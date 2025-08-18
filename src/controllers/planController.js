import Joi from 'joi';
import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listPlans = asyncHandler(async (req, res) => {
	const { category } = req.query;
	const filter = { isActive: true };
	if (category) filter.category = category;
	const plans = await Plan.find(filter).sort({ createdAt: -1 }).lean();
	return res.render('plans/index', { title: 'Plans', plans });
});

export const showPlan = asyncHandler(async (req, res) => {
	const plan = await Plan.findById(req.params.id).lean();
	if (!plan || !plan.isActive) return res.status(404).render('404', { title: 'Not Found' });
	return res.render('plans/show', { title: plan.title, plan });
});

export const adminListPlans = asyncHandler(async (req, res) => {
	const plans = await Plan.find().sort({ createdAt: -1 }).lean();
	return res.render('admin/plans', { title: 'Manage Plans', plans });
});

export const adminShowCreate = (req, res) => res.render('admin/plan-form', { title: 'Create Plan', plan: null });

export const adminCreatePlan = asyncHandler(async (req, res) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		category: Joi.string().valid('vps', 'dedicated', 'cloud').required(),
		description: Joi.string().allow(''),
		priceMonthly: Joi.number().min(0).required(),
		priceYearly: Joi.number().min(0).required(),
		features: Joi.string().allow('')
	});
	const data = await schema.validateAsync(req.body);
	const features = data.features ? data.features.split('\n').map((s) => s.trim()).filter(Boolean) : [];
	await Plan.create({ ...data, features });
	return res.redirect('/admin/plans');
});

export const adminShowEdit = asyncHandler(async (req, res) => {
	const plan = await Plan.findById(req.params.id).lean();
	if (!plan) return res.status(404).render('404', { title: 'Not Found' });
	return res.render('admin/plan-form', { title: 'Edit Plan', plan });
});

export const adminUpdatePlan = asyncHandler(async (req, res) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		category: Joi.string().valid('vps', 'dedicated', 'cloud').required(),
		description: Joi.string().allow(''),
		priceMonthly: Joi.number().min(0).required(),
		priceYearly: Joi.number().min(0).required(),
		features: Joi.string().allow(''),
		isActive: Joi.boolean().optional()
	});
	const data = await schema.validateAsync(req.body);
	const features = data.features ? data.features.split('\n').map((s) => s.trim()).filter(Boolean) : [];
	await Plan.findByIdAndUpdate(req.params.id, { ...data, features });
	return res.redirect('/admin/plans');
});

export const adminDeletePlan = asyncHandler(async (req, res) => {
	await Plan.findByIdAndDelete(req.params.id);
	return res.redirect('/admin/plans');
});

export default {
	listPlans,
	showPlan,
	adminListPlans,
	adminShowCreate,
	adminCreatePlan,
	adminShowEdit,
	adminUpdatePlan,
	adminDeletePlan
};

