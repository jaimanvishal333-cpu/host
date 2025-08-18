import User from '../models/User.js';
import Order from '../models/Order.js';
import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

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

export default { dashboard, listUsers, listOrders };

