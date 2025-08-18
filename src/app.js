import express from 'express';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';
import helmet from 'helmet';
import compression from 'compression';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { attachUserToLocals } from './middlewares/auth.js';
import { httpLogger } from './utils/logger.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import planRoutes from './routes/plans.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import ticketRoutes from './routes/tickets.js';
import contactRoutes from './routes/contact.js';
import userRoutes from './routes/user.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
	const app = express();
	app.set('trust proxy', 1);
	app.use(helmet());
	app.use(compression());
	app.use(httpLogger);
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(methodOverride('_method'));
	app.use(
		session({
			secret: env.sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production' },
			store: MongoStore.create({ mongoUrl: env.mongoUri })
		})
	);

	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, 'views'));
	app.use(expressLayouts);
	app.set('layout', 'layout');

	app.use('/public', express.static(path.join(__dirname, 'public')));
	app.use(attachUserToLocals);
	app.use((req, res, next) => {
		res.locals.cashfreeSandbox = env.cashfree.sandbox;
		next();
	});

	app.use('/', indexRoutes);
	app.use('/auth', authRoutes);
	app.use('/plans', planRoutes);
	app.use('/orders', orderRoutes);
	app.use('/admin', adminRoutes);
	app.use('/payment', paymentRoutes);
	app.use('/tickets', ticketRoutes);
	app.use('/contact', contactRoutes);
	app.use('/dashboard', userRoutes);

	app.use(notFound);
	app.use(errorHandler);

	return app;
}

export default createApp;

