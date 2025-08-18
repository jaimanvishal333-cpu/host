import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
		status: {
			type: String,
			enum: ['created', 'pending', 'paid', 'failed', 'cancelled', 'refunded'],
			default: 'created'
		},
		cfOrderId: { type: String },
		cfPaymentSessionId: { type: String },
		amount: { type: Number, required: true, min: 0 },
		currency: { type: String, default: 'INR' },
		invoiceNumber: { type: String },
		serverIP: { type: String },
		serverName: { type: String },
		credentials: { type: String }
	},
	{ timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;

