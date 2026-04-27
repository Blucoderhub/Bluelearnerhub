import Stripe from 'stripe';
import { db } from '../db';

// Initialize lazily to avoid circular dependency
let stripeInstance: Stripe | null = null;
let stripeKey: string | undefined;

function getStripe() {
  if (!stripeInstance && !stripeKey) {
    stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      stripeInstance = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
    }
  }
  return stripeInstance;
}

export const stripe = {
  get isConfigured() { return !!stripeKey; },
  // Forward to the actual Stripe instance lazily
  checkout: {
    sessions: {
      create: async (...args: any[]) => {
        const s = getStripe();
        if (!s) throw new Error('Stripe not configured');
        return (s.checkout.sessions.create as any)(...args);
      }
    }
  },
  subscriptions: {
    create: async (...args: any[]) => {
      const s = getStripe();
      if (!s) throw new Error('Stripe not configured');
      return (s.subscriptions.create as any)(...args);
    }
  },
  billingPortal: {
    sessions: {
      create: async (...args: any[]) => {
        const s = getStripe();
        if (!s) throw new Error('Stripe not configured');
        return (s.billingPortal.sessions.create as any)(...args);
      }
    }
  },
  webhooks: {
    constructEvent: (...args: any[]) => {
      const s = getStripe();
      if (!s) throw new Error('Stripe not configured');
      return (s.webhooks.constructEvent as any)(...args);
    }
  }
};

const PRICE_IDS = {
    EXPLORER: process.env.STRIPE_PRICE_EXPLORER!,
    INNOVATOR: process.env.STRIPE_PRICE_INNOVATOR!,
    ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE!,
};

export class StripeService {
    static async createCheckoutSession(userId: string, tier: 'EXPLORER' | 'INNOVATOR' | 'ENTERPRISE') {
        const user = await db.query.users.findFirst({
            _id: userId,
        });

        if (!user) throw new Error('User not found');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price: PRICE_IDS[tier],
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            metadata: {
                userId: userId.toString(),
                tier: tier,
            },
        });

        return session;
    }

    static async createPortalSession(userId: string) {
        const subscription = await db.query.userSubscriptions.findFirst({
            userId,
        });

        if (!subscription || !subscription.stripeCustomerId) {
            throw new Error('No active subscription found for this user');
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard`,
        });

        return session;
    }

    static async handleWebhook(event: Stripe.Event) {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any;
                const userId = session.metadata!.userId;
                const tier = session.metadata!.tier as any;

                // Upsert subscription
                const existing = await db.query.userSubscriptions.findFirst({ userId });
                if (existing) {
                    await db.query.userSubscriptions.update(
                        { userId },
                        { stripeCustomerId: session.customer as string, stripeSubscriptionId: session.subscription as string, tier }
                    );
                } else {
                    await db.query.userSubscriptions.create({
                        userId,
                        stripeCustomerId: session.customer as string,
                        stripeSubscriptionId: session.subscription as string,
                        tier,
                        createdAt: new Date(),
                    });
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const dbSub = await db.query.userSubscriptions.findFirst({
                    stripeSubscriptionId: subscription.id,
                });

                if (dbSub) {
                    await db.query.userSubscriptions.update(
                        { _id: dbSub._id },
                        { status: subscription.status as string, expiresAt: new Date(subscription.current_period_end * 1000) }
                    );
                }
                break;
            }
        }
    }
}
