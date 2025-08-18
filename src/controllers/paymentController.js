import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';
import { cashfreeClient } from '../config/cashfree.js';
import { env } from '../config/env.js';

export const createPaymentSession = asyncHandler(async (req, res) => {
	const order = await Order.findOne({ _id: req.params.id, user: req.session.user.id });
	if (!order) return res.status(404).render('404', { title: 'Not Found' });
	if (order.status === 'paid') return res.redirect(`/orders/${order._id}`);

	const orderId = `ORD-${uuidv4()}`;
	const payload = {
		order_id: orderId,
		order_amount: order.amount,
		order_currency: order.currency,
		customer_details: {
			customer_id: req.session.user.id,
			customer_email: req.session.user.email,
			customer_phone: '9999999999'
		},
		order_meta: {
			return_url: `${env.appUrl}/payment/callback/${order._id}?order_id={order_id}`
		}
	};

	const { data } = await cashfreeClient.post('/orders', payload);
	order.cfOrderId = data.order_id;
	order.cfPaymentSessionId = data.payment_session_id;
	order.status = 'pending';
	await order.save();
	return res.redirect(`/orders/${order._id}`);
});

export const paymentCallback = asyncHandler(async (req, res) => {
	const order = await Order.findOne({ _id: req.params.id, user: req.session.user.id });
	if (!order) return res.status(404).render('404', { title: 'Not Found' });

	// Fetch order status from Cashfree
	const { data } = await cashfreeClient.get(`/orders/${order.cfOrderId}`);
	if (data.order_status === 'PAID') {
		order.status = 'paid';
		await order.save();
		return res.redirect(`/orders/${order._id}`);
	}
	if (data.order_status === 'FAILED') {
		order.status = 'failed';
		await order.save();
	}
	return res.redirect(`/orders/${order._id}`);
});

export default { createPaymentSession, paymentCallback };

