import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporterPromise;

async function getTransporter() {
	if (transporterPromise) return transporterPromise;
	if (!env.mail.user || !env.mail.pass) {
		// Fallback to Ethereal test account if not provided
		const testAccount = await nodemailer.createTestAccount();
		transporterPromise = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: { user: testAccount.user, pass: testAccount.pass }
		});
		return transporterPromise;
	}
	transporterPromise = nodemailer.createTransport({
		host: env.mail.host,
		port: env.mail.port,
		secure: env.mail.port === 465,
		auth: { user: env.mail.user, pass: env.mail.pass }
	});
	return transporterPromise;
}

export async function sendMail({ to, subject, html }) {
	const transporter = await getTransporter();
	const info = await transporter.sendMail({
		from: `Hosting <no-reply@hosting.local>`,
		to,
		subject,
		html
	});
	return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
}

export default { sendMail };

