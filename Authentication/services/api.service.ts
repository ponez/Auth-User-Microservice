import { Throw401 } from '@Repositories/ErrorHelpers';
import { ServiceSchema } from 'moleculer';
import ApiGateway from 'moleculer-web';

const ApiService: ServiceSchema = {
	name: 'api',

	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT || 3000,

		routes: [
			{
				aliases: {
					'POST /signup': 'authentication.signup',
					'POST /resend-activation-token': 'authentication.resendActivationToken',
				},
				cors: {
					credentials: true,
					methods: ['GET', 'OPTIONS', 'POST'],
					origin: ['*'],
				},
				path: '/api/auth',
				whitelist: ['**'],
			},
			{
				aliases: {
					'POST /auth/login': 'authentication.login',
					'POST /auth/activate-account': 'authentication.activateAccount',
				},
				cors: {
					credentials: true,
					methods: ['GET', 'OPTIONS', 'POST'],
					origin: ['*'],
				},
				path: '/api',
				whitelist: ['**'],
				authorization: true,

				onBeforeCall(ctx, route, req, res) {
					if (!req.headers.authorization) {
						Throw401(null, 'Unauthorized');
					}
					ctx.meta.authToken = req.headers.authorization.split('Bearer')[1].trim();
				},
			},
		],
	},
};

export = ApiService;
