import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/checkout', authenticate, PaymentController.createCheckoutSession);
router.post('/portal', authenticate, PaymentController.createPortalSession);
router.post('/webhook', PaymentController.handleWebhook);

export default router;
