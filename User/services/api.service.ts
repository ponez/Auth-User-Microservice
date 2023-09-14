import {Throw401, Throw403} from '@Repositories/ErrorHelpers';
import {ServiceSchema} from 'moleculer';
import ApiGateway from 'moleculer-web';
import {config} from "@Config/config";
import {UserType} from "@Infrastructure/Enum/User";
import * as jwt from 'jsonwebtoken';

const ApiService: ServiceSchema = {
	name: 'api',

	mixins: [ApiGateway],

	settings: {
		port: config.port || 3001,

		routes: [
			{
				aliases: {
					'GET /details/:id': 'user.MyDetails',
				},
				cors: {
					credentials: true,
					methods: ['GET', 'OPTIONS', 'POST'],
					origin: ['*'],
				},
				path: '/api/user',
				whitelist: ['**'],
				async onBeforeCall(ctx, route, req, res) {
					if (!req.headers.authorization) {
						Throw401(null, 'Unauthorized');
					}
					const token = req.headers.authorization.split('Bearer')[1].trim();
					const {id, type} = await jwt.verify(token, config.jwt.jwtSecret);
					ctx.meta.userId = id
					ctx.meta.userType = type
				},
			},
			{
				aliases: {
					'GET /admin/user/details/:id': 'user.UserDetails',
					'GET /admin/user/list': 'user.UserList',
				},
				cors: {
					credentials: true,
					methods: ['GET', 'OPTIONS', 'POST'],
					origin: ['*'],
				},
				path: '/api',
				whitelist: ['**'],
				authorization: true,

				async onBeforeCall(ctx, route, req, res) {
					if (!req.headers.authorization) {
						Throw401(null, 'Unauthorized');
					}
					const token = req.headers.authorization.split('Bearer')[1].trim();

					const {id, type} = await jwt.verify(token, config.jwt.jwtSecret);

					if (type != UserType.ADMIN) Throw403(null, 'You don not have access to this endpoint')
					ctx.meta.userId = id
					ctx.meta.userType = type
				},
			},
		],
	},
};

export = ApiService;
