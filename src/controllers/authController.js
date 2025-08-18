import Joi from 'joi';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateOtp } from '../utils/otp.js';
import { sendMail } from '../utils/mailer.js';
import asyncHandler from '../utils/asyncHandler.js';

const emailSchema = Joi.string().email().required();

export const showLogin = (req, res) => res.render('auth/login', { title: 'Login' });
export const showRegister = (req, res) => res.render('auth/register', { title: 'Register' });
export const showForgot = (req, res) => res.render('auth/forgot', { title: 'Forgot Password' });
export const showReset = (req, res) => res.render('auth/reset', { title: 'Reset Password', token: req.query.token });
export const showVerifyOtp = (req, res) => res.render('auth/verify-otp', { title: 'Verify OTP', email: req.query.email });

export const register = asyncHandler(async (req, res) => {
	const schema = Joi.object({ name: Joi.string().min(2).required(), email: emailSchema, password: Joi.string().min(6).required() });
	const { name, email, password } = await schema.validateAsync(req.body);
	const existing = await User.findOne({ email });
	if (existing) return res.render('auth/register', { title: 'Register', error: 'Email already registered' });
	const passwordHash = await User.hashPassword(password);
	const user = await User.create({ name, email, passwordHash });
	const { otp, expiresAt } = generateOtp();
	await OTP.create({ email, code: otp, expiresAt });
	await sendMail({ to: email, subject: 'Verify your email', html: `<p>Your OTP is <b>${otp}</b>, valid for 10 minutes.</p>` });
	return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
});

export const verifyOtp = asyncHandler(async (req, res) => {
	const { email, code } = req.body;
	await emailSchema.validateAsync(email);
	const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
	if (!otpDoc || otpDoc.code !== code || otpDoc.expiresAt < new Date()) {
		return res.render('auth/verify-otp', { title: 'Verify OTP', email, error: 'Invalid or expired OTP' });
	}
	await User.updateOne({ email }, { $set: { isEmailVerified: true } });
	await OTP.deleteMany({ email });
	return res.redirect('/auth/login');
});

export const login = asyncHandler(async (req, res) => {
	const schema = Joi.object({ email: emailSchema, password: Joi.string().required() });
	const { email, password } = await schema.validateAsync(req.body);
	const user = await User.findOne({ email });
	if (!user) return res.render('auth/login', { title: 'Login', error: 'Invalid email or password' });
	const ok = await user.comparePassword(password);
	if (!ok) return res.render('auth/login', { title: 'Login', error: 'Invalid email or password' });
	if (!user.isEmailVerified) return res.render('auth/login', { title: 'Login', error: 'Please verify your email first' });
	req.session.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
	const redirectTo = req.session.returnTo || '/';
	delete req.session.returnTo;
	return res.redirect(redirectTo);
});

export const logout = (req, res) => {
	req.session.destroy(() => res.redirect('/'));
};

export default { showLogin, showRegister, showForgot, showReset, showVerifyOtp, register, verifyOtp, login, logout };

