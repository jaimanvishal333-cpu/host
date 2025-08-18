import Joi from 'joi';
import Order from '../models/Order.js';
import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.session.user.id })
		.populate('plan')
		.sort({ createdAt: -1 })
		.lean();
	return res.render('orders/index', { title: 'My Orders', orders });
});

export const createOrder = asyncHandler(async (req, res) => {
	const schema = Joi.object({ planId: Joi.string().required(), billing: Joi.string().valid('monthly', 'yearly').default('monthly') });
	const { planId, billing } = await schema.validateAsync(req.body);
	const plan = await Plan.findById(planId);
	if (!plan || !plan.isActive) return res.status(400).render('404', { title: 'Invalid plan' });
	const amount = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
	const order = await Order.create({ user: req.session.user.id, plan: plan._id, amount });
	return res.redirect(`/orders/${order._id}`);
});

export const showOrder = asyncHandler(async (req, res) => {
	const order = await Order.findOne({ _id: req.params.id, user: req.session.user.id }).populate('plan').lean();
	if (!order) return res.status(404).render('404', { title: 'Not Found' });
	return res.render('orders/show', { title: 'Order', order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
	await Order.deleteOne({ _id: req.params.id, user: req.session.user.id, status: { $in: ['created', 'failed', 'cancelled'] } });
	return res.redirect('/orders');
});

export default { listOrders, createOrder, showOrder, deleteOrder };

