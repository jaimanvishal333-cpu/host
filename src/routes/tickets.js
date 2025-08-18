import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.js';
import { listTickets, showCreate, createTicket, showTicket, replyTicket } from '../controllers/ticketController.js';

const router = Router();
router.use(ensureAuthenticated);
router.get('/', listTickets);
router.get('/new', showCreate);
router.post('/', createTicket);
router.get('/:id', showTicket);
router.post('/:id/reply', replyTicket);

export default router;

