import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getHome = asyncHandler(async (req, res) => {
	const plans = await Plan.find({ isActive: true }).sort({ createdAt: -1 }).limit(6).lean();
	return res.render('plans/index', { title: 'Home', plans });
});

export default { getHome };

