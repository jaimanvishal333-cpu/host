import Joi from 'joi';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Ticket from '../models/Ticket.js';
import asyncHandler from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
	const [ordersCount, ticketsCount] = await Promise.all([
		Order.countDocuments({ user: req.session.user.id }),
		Ticket.countDocuments({ user: req.session.user.id })
	]);
	return res.render('user/dashboard', { title: 'Dashboard', stats: { ordersCount, ticketsCount } });
});

export const showProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.session.user.id).lean();
	return res.render('user/profile', { title: 'Edit Profile', user });
});

export const updateProfile = asyncHandler(async (req, res) => {
	const schema = Joi.object({ name: Joi.string().min(2).required(), password: Joi.string().min(6).allow('') });
	const { name, password } = await schema.validateAsync(req.body);
	const updates = { name };
	if (password) updates.passwordHash = await User.hashPassword(password);
	await User.findByIdAndUpdate(req.session.user.id, updates);
	req.session.user.name = name;
	return res.redirect('/dashboard/profile');
});

export default { dashboard, showProfile, updateProfile };

