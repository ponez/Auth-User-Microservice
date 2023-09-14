export const config = {
	jwt: {
		jwtSaltRounds: 12,
		jwtSecret: 'asdasldpasl',
		jwtActiveAccountSecret: 'asdassdsdsdldpasl',
	},
	mongodbConfig: {
		type: 'mongodb',
		host: 'localhost',
		port: 27017,
		synchronize: true,
		logging: true,
		db: 'authdb',
	},
};
