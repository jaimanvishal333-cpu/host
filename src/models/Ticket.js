import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		message: { type: String, required: true }
	},
	{ timestamps: true }
);

const ticketSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		subject: { type: String, required: true },
		message: { type: String, required: true },
		status: { type: String, enum: ['open', 'pending', 'resolved'], default: 'open' },
		replies: [replySchema]
	},
	{ timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

