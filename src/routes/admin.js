import { Router } from 'express';
import { ensureAdmin } from '../middlewares/admin.js';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { adminListPlans, adminShowCreate, adminCreatePlan, adminShowEdit, adminUpdatePlan, adminDeletePlan } from '../controllers/planController.js';
import { dashboard, listUsers, listOrders } from '../controllers/adminController.js';

const router = Router();

router.use(ensureAuthenticated, ensureAdmin);

router.get('/', dashboard);
router.get('/users', listUsers);
router.get('/orders', listOrders);

router.get('/plans', adminListPlans);
router.get('/plans/new', adminShowCreate);
router.post('/plans', adminCreatePlan);
router.get('/plans/:id/edit', adminShowEdit);
router.post('/plans/:id', adminUpdatePlan);
router.post('/plans/:id/delete', adminDeletePlan);

export default router;

