import { config } from '@Config/config';
import { User } from '@Entities/User';
import { Connection, createConnection } from 'typeorm';

export default async (): Promise<Connection | undefined> => {
	try {
		const { mongodbConfig } = config;
		return await createConnection({
			type: 'mongodb',
			host: mongodbConfig.host,
			port: mongodbConfig.port,
			database: mongodbConfig.db,
			entities: [User],
			synchronize: mongodbConfig.synchronize,
			logging: mongodbConfig.logging,
		});
	} catch (error) {
		return undefined;
	}
};
