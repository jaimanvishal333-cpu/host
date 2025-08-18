import { createServer } from 'http';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { connectToDatabase } from './config/db.js';
import { bootstrap } from './config/bootstrap.js';

async function start() {
	await connectToDatabase();
	await bootstrap({
		adminEmail: process.env.ADMIN_EMAIL,
		adminPassword: process.env.ADMIN_PASSWORD,
		adminName: process.env.ADMIN_NAME
	});
	const app = createApp();
	const server = createServer(app);
	server.listen(env.port, () => {
		// eslint-disable-next-line no-console
		console.log(`Server running on ${env.appUrl} in ${env.nodeEnv} mode`);
	});
}

start().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Failed to start server', err);
	process.exit(1);
});