import { Router } from 'express';
import { listPlans, showPlan } from '../controllers/planController.js';

const router = Router();

router.get('/', listPlans);
router.get('/:id', showPlan);

export default router;

