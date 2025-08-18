import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { dashboard, showProfile, updateProfile } from '../controllers/userController.js';

const router = Router();
router.use(ensureAuthenticated);
router.get('/', dashboard);
router.get('/profile', showProfile);
router.post('/profile', updateProfile);

export default router;

