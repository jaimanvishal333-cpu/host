import { Router } from 'express';
import { showContact, submitContact } from '../controllers/contactController.js';

const router = Router();
router.get('/', showContact);
router.post('/', submitContact);

export default router;

