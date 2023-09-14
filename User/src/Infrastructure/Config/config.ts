export const config = {
	jwt: {
		jwtSecret: 'asdasldpasl',
	},
	mysqlConfig: {
		type: 'mysql',
		username: "root",
		password: "1111",
		host: 'localhost',
		port: 3306,
		synchronize: true,
		logging: true,
		db: 'userdb',
	},
	port: 3001
};
