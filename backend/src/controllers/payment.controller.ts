import { Request, Response } from 'express';
import { StripeService, stripe } from '../services/stripe.service';
import logger from '../utils/logger';

export class PaymentController {
    static async createCheckoutSession(req: Request, res: Response) {
        try {
            const { tier } = req.body;
            const userId = req.user!.id;

            if (!['EXPLORER', 'INNOVATOR', 'ENTERPRISE'].includes(tier)) {
                return res.status(400).json({ success: false, message: 'Invalid subscription tier' });
            }

            const session = await StripeService.createCheckoutSession(userId, tier as any);
            res.json({ success: true, data: { url: session.url } });
        } catch (error: any) {
            logger.error('createCheckoutSession error', error);
            res.status(500).json({ success: false, message: 'Failed to create checkout session' });
        }
    }

    static async createPortalSession(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const session = await StripeService.createPortalSession(userId);
            res.json({ success: true, data: { url: session.url } });
        } catch (error: any) {
            logger.error('createPortalSession error', error);
            res.status(500).json({ success: false, message: 'Failed to create portal session' });
        }
    }

    static async handleWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            logger.error('STRIPE_WEBHOOK_SECRET not configured');
            return res.status(500).json({ success: false, message: 'Webhook not configured' });
        }
        if (!sig) {
            return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
        }

        try {
            // req.body is a raw Buffer here (express.raw middleware applied at route level)
            const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            await StripeService.handleWebhook(event);
            res.json({ received: true });
        } catch (error: any) {
            // Stripe signature mismatch — log internally, return generic message
            logger.warn('Stripe webhook signature verification failed', { message: error.message });
            res.status(400).json({ success: false, message: 'Webhook verification failed' });
        }
    }
}
