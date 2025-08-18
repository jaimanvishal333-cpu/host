import Joi from 'joi';
import Ticket from '../models/Ticket.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listTickets = asyncHandler(async (req, res) => {
	const tickets = await Ticket.find({ user: req.session.user.id }).sort({ createdAt: -1 }).lean();
	return res.render('tickets/index', { title: 'My Tickets', tickets });
});

export const showCreate = (req, res) => res.render('tickets/new', { title: 'New Ticket' });

export const createTicket = asyncHandler(async (req, res) => {
	const schema = Joi.object({ subject: Joi.string().required(), message: Joi.string().required() });
	const { subject, message } = await schema.validateAsync(req.body);
	await Ticket.create({ user: req.session.user.id, subject, message });
	return res.redirect('/tickets');
});

export const showTicket = asyncHandler(async (req, res) => {
	const ticket = await Ticket.findOne({ _id: req.params.id, user: req.session.user.id }).populate('replies.user').lean();
	if (!ticket) return res.status(404).render('404', { title: 'Not Found' });
	return res.render('tickets/show', { title: 'Ticket', ticket });
});

export const replyTicket = asyncHandler(async (req, res) => {
	const schema = Joi.object({ message: Joi.string().required() });
	const { message } = await schema.validateAsync(req.body);
	await Ticket.updateOne({ _id: req.params.id, user: req.session.user.id }, { $push: { replies: { user: req.session.user.id, message } }, $set: { status: 'pending' } });
	return res.redirect(`/tickets/${req.params.id}`);
});

export default { listTickets, showCreate, createTicket, showTicket, replyTicket };

