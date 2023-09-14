import { config } from '@Config/config';
import { User } from '@Entities';
import connectionInstance from '@Entities/Connection';
import type { IAuthentication } from '@Interfaces';
import { UserRepository } from '@Repositories';
import { Throw400, Throw401 } from '@Repositories/ErrorHelpers';
import amqp from 'amqplib';
import { compare, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { Context } from 'moleculer';
import { Service as MoleculerService } from 'moleculer';
import { Action, Method, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';

@Service({
	name: 'authentication',

	transporter: {
		type: 'AMQP',
		options: {
			url: 'amqp://test:password@localhost:5672',
			eventTimeToLive: 5000,
			prefetch: 1,
		},
	},
})
export class AuthenticationService extends MoleculerService {
	channel;
	connection;

	public async started() {
		await connectionInstance();
		this.connection = await amqp.connect('amqp://test:password@localhost:5672');
		this.channel = await this.connection.createChannel();
	}

	@Action({
		params: {
			email: { type: 'email', label: 'Email Address', max: 50 },
			username: { type: 'string', min: 2, max: 20 },
			password: {
				type: 'string',
				min: 6,
				max: 22,
				pattern: /((?=.*\d)|(?=.*\W+))(?![.\n]).*$/,
			},
		},
	})
	public async signup(ctx: Context<IAuthentication.SignupDto>) {
		return await this.SignUpMethod(ctx);
	}

	@Action({
		params: {
			email: { type: 'email', label: 'Email Address', max: 50 },
			password: {
				type: 'string',
				min: 6,
				max: 22,
				pattern: /((?=.*\d)|(?=.*\W+))(?![.\n]).*$/,
			},
		},
	})
	public async resendActivationToken(ctx: Context<IAuthentication.LoginDto>) {
		return await this.resendActivationTokenMethod(ctx);
	}

	@Action({
		params: {
			email: { type: 'email', label: 'Email Address', max: 50 },
			password: {
				type: 'string',
				min: 6,
				max: 22,
				pattern: /((?=.*\d)|(?=.*\W+))(?![.\n]).*$/,
			},
		},
	})
	public async activateAccount(ctx: Context) {
		return await this.activateAccountMethod(ctx);
	}

	@Action({
		params: {
			email: { type: 'email', label: 'Email Address', max: 50 },
			username: { type: 'string', min: 2, max: 20 },
			password: {
				type: 'string',
				min: 6,
				max: 22,
				pattern: /((?=.*\d)|(?=.*\W+))(?![.\n]).*$/,
			},
		},
	})
	public async login(ctx: Context<IAuthentication.LoginDto>) {
		return await this.LoginMethod(ctx);
	}

	@Action({
		cache: {
			keys: ['token'],
			ttl: 60 * 60, // 1 hour
		},
		params: {
			token: 'string',
		},
	})
	async resolveToken(ctx) {
		const decoded: IAuthentication.IToken = await jwt.verify(
			ctx.params.token,
			this.settings.JWT_SECRET,
		);

		if (!decoded.id) {
			Throw401(null, 'bad token');
		}
		return await UserRepository.findOneWithId(decoded.id);
	}

	@Method
	public async SignUpMethod(ctx: Context<IAuthentication.SignupDto>) {
		const { email, username, password } = ctx.params;
		let user = await UserRepository.findOneWithEmailForSignUp(email);
		if (user) {
			Throw400(null, 'already exist');
		}
		user = new User();
		user.username = username;
		user.email = email;
		user.password = hashSync(password, config.jwt.jwtSaltRounds);
		user.isActive = false;

		this.generateActiveAccountJWT(user);
		return await user.save();
	}

	@Method
	public async activateAccountMethod(ctx: Context) {
		const token = ctx.meta['authToken'];

		const { id } = await jwt.verify(token, config.jwt.jwtActiveAccountSecret);
		const user = await UserRepository.findOneWithId(id);

		user.isActive = true;
		await user.save();
		const queue = 'create_user_queue';

		await this.channel.assertQueue(queue);
		await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
		return { message: 'done' };
	}

	@Method
	public async LoginMethod(ctx: Context<IAuthentication.LoginDto>) {
		const { email, password } = ctx.params;

		const user = await UserRepository.findOneWithEmail(email);

		const validatePassword = await compare(password, user.password);

		if (!validatePassword) {
			Throw401(null, 'Wrong password');
		}

		if (!user.isActive) {
			Throw401(undefined, 'User is not active yet');
		}

		return { token: this.generateJWT(user) };
	}

	@Method
	generateJWT(user: User) {
		const today = new Date();
		const exp = new Date(today);
		exp.setDate(today.getDate() + 60);

		return jwt.sign(
			{
				id: user.id,
				username: user.username,
				type: user.type,
				exp: Math.floor(exp.getTime() / 1000),
			},
			config.jwt.jwtSecret,
		);
	}

	@Method
	async resendActivationTokenMethod(ctx) {
		const { email, password } = ctx.params;

		const user = await UserRepository.findOneWithEmail(email);

		const validatePassword = await compare(password, user.password);

		if (!validatePassword) {
			Throw401(null, 'Wrong password');
		}
		if (user.isActive) {
			Throw400(undefined, 'User is already activated');
		}

		await this.generateActiveAccountJWT(user);
		return { message: 'done' };
	}

	@Method
	generateActiveAccountJWT(user: User) {
		const today = new Date();
		const exp = new Date(today);
		exp.setHours(exp.getHours() + 1); // Adds 1 hours

		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				type: user.type,
				exp: Math.floor(exp.getTime() / 1000),
			},
			config.jwt.jwtActiveAccountSecret,
		);

		// we could send this to an email using email transporter and emitting this as a message
		console.log(token);
	}

	public async stopped() {
		await getConnection().close();
		await this.channel.close();
		await this.connection.close();
	}
}

module.exports = AuthenticationService;
