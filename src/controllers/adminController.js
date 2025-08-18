import User from '../models/User.js';
import Order from '../models/Order.js';
import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';
import Joi from 'joi';

export const dashboard = asyncHandler(async (req, res) => {
	const [usersCount, ordersCount, plansCount, paidOrders] = await Promise.all([
		User.countDocuments(),
		Order.countDocuments(),
		Plan.countDocuments(),
		Order.countDocuments({ status: 'paid' })
	]);
	return res.render('admin/dashboard', {
		title: 'Admin Dashboard',
		stats: { usersCount, ordersCount, plansCount, paidOrders }
	});
});

export const listUsers = asyncHandler(async (req, res) => {
	const users = await User.find().sort({ createdAt: -1 }).lean();
	return res.render('admin/users', { title: 'Users', users });
});

export const listOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find().populate('plan').populate('user').sort({ createdAt: -1 }).lean();
	return res.render('admin/orders', { title: 'Orders', orders });
});

export const editOrderCreds = asyncHandler(async (req, res) => {
	const schema = Joi.object({ serverIP: Joi.string().allow(''), serverName: Joi.string().allow(''), credentials: Joi.string().allow('') });
	const data = await schema.validateAsync(req.body);
	await Order.findByIdAndUpdate(req.params.id, data);
	return res.redirect('/admin/orders');
});

export default { dashboard, listUsers, listOrders, editOrderCreds };

