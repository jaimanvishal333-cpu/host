import dotenv from 'dotenv';

dotenv.config();

export const env = {
	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hosting_app',
	sessionSecret: process.env.SESSION_SECRET || 'dev_secret_change_me',
	appUrl: process.env.APP_URL || 'http://localhost:3000',
	mail: {
		host: process.env.MAIL_HOST || 'smtp.ethereal.email',
		port: Number(process.env.MAIL_PORT || 587),
		user: process.env.MAIL_USER || '',
		pass: process.env.MAIL_PASS || ''
	},
	cashfree: {
		appId: process.env.CASHFREE_APP_ID || '',
		secretKey: process.env.CASHFREE_SECRET_KEY || '',
		sandbox: process.env.CASHFREE_SANDBOX !== 'false'
	}
};

export default env;

