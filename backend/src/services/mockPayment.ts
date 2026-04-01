import { pool } from '../utils/database';
import logger from '../utils/logger';

export interface MockPaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  message: string;
}

export class MockPaymentService {
  private static generateTransactionId(): string {
    return `TXN_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  static async processPayment(
    userId: number,
    hackathonId: number,
    amount: number
  ): Promise<MockPaymentResult> {
    try {
      const transactionId = this.generateTransactionId();
      
      logger.info(`Mock payment processing: ${transactionId} for user ${userId}, hackathon ${hackathonId}, amount ${amount}`);

      await pool.query(
        `INSERT INTO mock_payments (transaction_id, user_id, hackathon_id, amount, status, created_at)
         VALUES ($1, $2, $3, $4, 'completed', NOW())`,
        [transactionId, userId, hackathonId, amount]
      );

      await pool.query(
        `UPDATE hackathon_registrations 
         SET payment_status = 'paid', payment_id = $1
         WHERE user_id = $2 AND hackathon_id = $3`,
        [transactionId, userId, hackathonId]
      );

      return {
        success: true,
        transactionId,
        amount,
        status: 'completed',
        message: 'Payment successful (mock)',
      };
    } catch (error) {
      logger.error('Mock payment failed:', error);
      return {
        success: false,
        transactionId: '',
        amount: 0,
        status: 'failed',
        message: 'Payment processing failed',
      };
    }
  }

  static async getPaymentStatus(transactionId: string): Promise<MockPaymentResult | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM mock_payments WHERE transaction_id = $1',
        [transactionId]
      );

      if (result.rows.length === 0) return null;

      const payment = result.rows[0];
      return {
        success: payment.status === 'completed',
        transactionId: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        message: payment.status === 'completed' ? 'Payment successful' : 'Payment pending',
      };
    } catch (error) {
      logger.error('Error getting payment status:', error);
      return null;
    }
  }
}
