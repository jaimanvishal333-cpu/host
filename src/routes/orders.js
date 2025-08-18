import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { listOrders, createOrder, showOrder, deleteOrder, downloadInvoice } from '../controllers/orderController.js';
import { createPaymentSession } from '../controllers/paymentController.js';

const router = Router();

router.use(ensureAuthenticated);
router.get('/', listOrders);
router.post('/', createOrder);
router.get('/:id', showOrder);
router.post('/:id/delete', deleteOrder);
router.post('/:id/pay', createPaymentSession);
router.get('/:id/invoice', downloadInvoice);

export default router;

