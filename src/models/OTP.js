import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, index: true },
		code: { type: String, required: true },
		expiresAt: { type: Date, required: true }
	},
	{ timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model('OTP', otpSchema);
export default OTP;

