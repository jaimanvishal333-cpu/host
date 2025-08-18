import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { paymentCallback } from '../controllers/paymentController.js';

const router = Router();

router.use(ensureAuthenticated);
router.get('/callback/:id', paymentCallback);

export default router;

