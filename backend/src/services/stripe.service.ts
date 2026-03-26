import Stripe from 'stripe';
import { db } from '../db';
import { users, userSubscriptions } from '../db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2023-10-16' as any })
  : null as unknown as Stripe;

const PRICE_IDS = {
    EXPLORER: process.env.STRIPE_PRICE_EXPLORER!,
    INNOVATOR: process.env.STRIPE_PRICE_INNOVATOR!,
    ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE!,
};

export class StripeService {
    static async createCheckoutSession(userId: number, tier: 'EXPLORER' | 'INNOVATOR' | 'ENTERPRISE') {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
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

    static async createPortalSession(userId: number) {
        const subscription = await db.query.userSubscriptions.findFirst({
            where: eq(userSubscriptions.userId, userId),
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
                const session = event.data.object as any; // Cast to any to access metadata safely
                const userId = parseInt(session.metadata!.userId);
                const tier = session.metadata!.tier as any;

                await db.insert(userSubscriptions).values({
                    userId,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    tier,
                    status: 'active',
                    currentPeriodEnd: new Date(), // Will be updated by invoice.paid or subscription.updated
                }).onConflictDoUpdate({
                    target: userSubscriptions.userId,
                    set: {
                        stripeSubscriptionId: session.subscription as string,
                        tier,
                        status: 'active',
                        updatedAt: new Date(),
                    }
                });
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const dbSub = await db.query.userSubscriptions.findFirst({
                    where: eq(userSubscriptions.stripeSubscriptionId, subscription.id),
                });

                if (dbSub) {
                    await db.update(userSubscriptions)
                        .set({
                            status: subscription.status as string,
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                            updatedAt: new Date(),
                        })
                        .where(eq(userSubscriptions.id, dbSub.id));
                }
                break;
            }
        }
    }
}
