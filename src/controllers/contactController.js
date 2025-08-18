import Joi from 'joi';
import Contact from '../models/Contact.js';
import { sendMail } from '../utils/mailer.js';
import asyncHandler from '../utils/asyncHandler.js';

export const showContact = (req, res) => res.render('contact', { title: 'Contact Us' });

export const submitContact = asyncHandler(async (req, res) => {
	const schema = Joi.object({ name: Joi.string().required(), email: Joi.string().email().required(), message: Joi.string().required() });
	const data = await schema.validateAsync(req.body);
	await Contact.create(data);
	try { await sendMail({ to: data.email, subject: 'We received your message', html: `<p>Thanks ${data.name}, we will get back to you soon.</p>` }); } catch {}
	return res.render('contact', { title: 'Contact Us', success: 'Message received. We will get back to you.' });
});

export default { showContact, submitContact };

