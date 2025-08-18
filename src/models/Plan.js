import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		category: { type: String, enum: ['vps', 'dedicated', 'cloud'], required: true },
		description: { type: String, default: '' },
		priceMonthly: { type: Number, required: true, min: 0 },
		priceYearly: { type: Number, required: true, min: 0 },
		features: [{ type: String }],
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

export const Plan = mongoose.model('Plan', planSchema);
export default Plan;

