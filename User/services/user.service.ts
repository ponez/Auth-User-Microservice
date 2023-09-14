import connectionInstance from '@Entities/Connection';
import amqp from 'amqplib';
import type {Context} from 'moleculer';
import {Service as MoleculerService} from 'moleculer';
import {Action, Method, Service} from 'moleculer-decorators';
import {getConnection} from 'typeorm';
import {UserRepository} from "@Repositories";
import {IUser} from "@Interfaces/Services/User/IUser";
import {User} from "@Entities";

@Service({
	name: 'user',

	transporter: {
		type: 'AMQP',
		options: {
			url: 'amqp://test:password@localhost:5672',
			eventTimeToLive: 5000,
			prefetch: 1,
		},
	},
})
export class UserService extends MoleculerService {
	channel;
	connection;

	public async started() {
		await connectionInstance();
		this.connection = await amqp.connect('amqp://test:password@localhost:5672');
		this.channel = await this.connection.createChannel();
		await this.consumeUserFromAuthMicroservice()
	}

	@Action()
	public async MyDetails(ctx: Context) {
		return await this.MyDetailsMethod(ctx);
	}

	@Method
	async MyDetailsMethod(ctx: Context) {
		const id = ctx.meta['userId'];
		return await UserRepository.findOneWithMongoId(id);
	}

	@Action({
		params: {
			id: {
				type: 'string',
			},
		}
	})
	public async UserDetails(ctx: Context<IUser.IdInput>) {
		return await this.UserDetailsMethod(ctx);
	}

	@Method
	async UserDetailsMethod(ctx: Context<IUser.IdInput>) {
		console.log(ctx.params)
		const {id} = ctx.params
		return await UserRepository.findOneWithMongoId(id);
	}

	@Action()
	public async UserList(ctx: Context) {
		return await this.UserListMethod(ctx);
	}

	@Method
	async UserListMethod(ctx: Context) {
		return await UserRepository.findAllUsers();
	}

	async consumeUserFromAuthMicroservice() {
		try {
			const queue = 'create_user_queue';
			await this.channel.assertQueue(queue);

			this.channel.consume(queue, async (message) => {
				if (message == null) return;

				try {
					const userData = JSON.parse(message.content.toString());
					console.log('Received user:', userData);

					let user = await UserRepository.findOneWithMongoIdOrFail(userData.id);

					if (!user) {
						user = await UserRepository.findOneWithEmailOrFail(userData.email);
					}

					if (!user) {
						user = new User();
					}

					user.username = userData.username;
					user.email = userData.email;
					user.mongodbId = userData.id;

					await user.save();

					// Acknowledge the message to remove it from the queue
					this.channel.ack(message);
				} catch (error) {
					console.error('Error processing message:', error);

					// Reject the message to move it to a dead letter queue (DLQ)
					// or configure your RabbitMQ setup to handle retries
					this.channel.reject(message, false); // Set the second argument to true for requeue
				}
			});
		} catch (e) {
			// Handle any errors that occur during queue setup
			console.error('Queue setup error:', e);
		}
	}

	public async stopped() {
		await getConnection().close();
		await this.channel.close();
		await this.connection.close();
	}
}

module.exports = UserService;
