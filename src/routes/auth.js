import { Router } from 'express';
import { showLogin, showRegister, showForgot, showReset, showVerifyOtp, register, verifyOtp, login, logout } from '../controllers/authController.js';

const router = Router();

router.get('/login', showLogin);
router.post('/login', login);
router.get('/register', showRegister);
router.post('/register', register);
router.get('/verify-otp', showVerifyOtp);
router.post('/verify-otp', verifyOtp);
router.get('/forgot', showForgot);
router.get('/reset', showReset);
router.post('/logout', logout);

export default router;

