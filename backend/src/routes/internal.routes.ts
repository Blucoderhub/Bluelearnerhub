/**
 * INTERNAL API ROUTES
 * ===================
 * Backend-to-Backend communication
 * Protected by API key authentication
 * 
 * Use cases:
 * - Payment verification (Stripe webhooks)
 * - Token verification between services
 * - Cross-service data queries
 * - Report generation
 */

import { Router } from 'express';
import { internalApiKeyAuth, verifyWebhookSignature } from '../middleware/internalAuth';
import { pool } from '../utils/database';
import { config } from '../config';
import logger from '../utils/logger';

const router = Router();

// All internal routes require API key
router.use(internalApiKeyAuth);

// ─── Health & Status ─────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'internal-api',
    timestamp: new Date().toISOString(),
  });
});

// ─── Payment Verification (Stripe Webhooks) ──────────────────────────────────
router.post('/payments/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!verifyWebhookSignature(payload, signature, config.stripe.webhookSecret || '')) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    logger.info(`Stripe webhook: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await pool.query(
          `INSERT INTO payment_transactions (transaction_id, amount, currency, status, metadata)
           VALUES ($1, $2, $3, 'succeeded', $4)
           ON CONFLICT (transaction_id) DO NOTHING`,
          [
            paymentIntent.id,
            paymentIntent.amount / 100,
            paymentIntent.currency,
            JSON.stringify(paymentIntent.metadata || {}),
          ]
        );
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        logger.warn(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await pool.query(
          `UPDATE user_subscriptions 
           SET status = $1, updated_at = NOW()
           WHERE stripe_subscription_id = $2`,
          [
            subscription.status,
            subscription.id,
          ]
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ─── Token Verification ────────────────────────────────────────────────────────
router.get('/verify-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, config.jwt.secret) as any;

    const user = await pool.query(
      `SELECT id, email, full_name, role, is_active, is_banned 
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userData = user.rows[0];

    res.json({
      success: true,
      data: {
        userId: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        isActive: userData.is_active,
        isBanned: userData.is_banned,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});

// ─── Cross-Service User Query ────────────────────────────────────────────────
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields = '*' } = req.query;

    const result = await pool.query(
      `SELECT ${fields} FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Internal user query error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// ─── Report Generation ────────────────────────────────────────────────────────
router.get('/reports/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    let reportQuery = '';
    const params: any[] = [];

    switch (type) {
      case 'user-growth':
        reportQuery = `
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as new_users
          FROM users
          WHERE created_at >= COALESCE($1, NOW() - INTERVAL '30 days')
            AND created_at <= COALESCE($2, NOW())
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `;
        params.push(startDate, endDate);
        break;

      case 'hackathon-activity':
        reportQuery = `
          SELECT 
            h.id,
            h.title,
            COUNT(DISTINCT hr.user_id) as participants,
            COUNT(DISTINCT hs.id) as submissions
          FROM hackathons h
          LEFT JOIN hackathon_registrations hr ON h.id = hr.hackathon_id
          LEFT JOIN hackathon_submissions hs ON h.id = hs.hackathon_id
          WHERE h.created_at >= COALESCE($1, NOW() - INTERVAL '30 days')
          GROUP BY h.id, h.title
          ORDER BY h.created_at DESC
          LIMIT 50
        `;
        params.push(startDate, endDate);
        break;

      case 'engagement':
        reportQuery = `
          SELECT 
            DATE(last_active) as date,
            COUNT(*) as active_users
          FROM users
          WHERE last_active >= COALESCE($1, NOW() - INTERVAL '30 days')
            AND last_active <= COALESCE($2, NOW())
          GROUP BY DATE(last_active)
          ORDER BY date DESC
        `;
        params.push(startDate, endDate);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type',
        });
    }

    const result = await pool.query(reportQuery, params);

    res.json({
      success: true,
      data: result.rows,
      meta: {
        type,
        startDate,
        endDate,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
    });
  }
});

// ─── Bulk User Operations ─────────────────────────────────────────────────────
router.post('/users/bulk', async (req, res) => {
  try {
    const { action, userIds } = req.body;

    if (!action || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'action and userIds array are required',
      });
    }

    switch (action) {
      case 'activate':
        await pool.query(
          `UPDATE users SET is_active = true WHERE id = ANY($1)`,
          [userIds]
        );
        break;

      case 'deactivate':
        await pool.query(
          `UPDATE users SET is_active = false WHERE id = ANY($1)`,
          [userIds]
        );
        break;

      case 'ban':
        await pool.query(
          `UPDATE users SET is_banned = true WHERE id = ANY($1)`,
          [userIds]
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
        });
    }

    res.json({
      success: true,
      message: `Bulk action '${action}' completed for ${userIds.length} users`,
    });
  } catch (error) {
    logger.error('Bulk user operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed',
    });
  }
});

export default router;
