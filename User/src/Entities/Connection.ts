import {config} from '@Config/config';
import {User} from '@Entities/User';
import {Connection, createConnection} from 'typeorm';

export default async (): Promise<Connection | undefined> => {
	try {
		const {mysqlConfig} = config;
		return await createConnection({
			type: 'mysql',
			host: mysqlConfig.host,
			port: mysqlConfig.port,
			username: mysqlConfig.username,
			password: mysqlConfig.password,
			database: mysqlConfig.db,
			entities: [User],
			synchronize: mysqlConfig.synchronize,
			logging: mysqlConfig.logging,
		});
	} catch (error) {
		console.log(error)
		return undefined;
	}
};
