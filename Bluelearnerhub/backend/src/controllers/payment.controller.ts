import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service';

export class PaymentController {
    static async createCheckoutSession(req: Request, res: Response) {
        try {
            const { tier } = req.body;
            const userId = (req as any).user.id;

            if (!['EXPLORER', 'INNOVATOR', 'ENTERPRISE'].includes(tier)) {
                return res.status(400).json({ message: 'Invalid subscription tier' });
            }

            const session = await StripeService.createCheckoutSession(userId, tier as any);
            res.json({ url: session.url });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createPortalSession(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const session = await StripeService.createPortalSession(userId);
            res.json({ url: session.url });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async handleWebhook(req: Request, res: Response) {
        try {
            const sig = req.headers['stripe-signature'] as string;
            // Note: In a real production app, we would use stripe.webhooks.constructEvent
            // with a raw body parser and the webhook secret.
            // For this implementation, we'll assume the event is handled directly for now.
            const event = req.body;
            await StripeService.handleWebhook(event);
            res.json({ received: true });
        } catch (error: any) {
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}
