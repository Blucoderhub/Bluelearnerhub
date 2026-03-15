import { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
import { asyncHandler } from '../middleware/error.middleware';
import { pool } from '../utils/database';
import logger from '../utils/logger';

const ENABLE_FULL_PII_LOGGING = process.env.ENABLE_FULL_PII_LOGGING === 'true';
const DEFAULT_RETENTION_DAYS = 30;
const MAX_RETENTION_DAYS = 3650;

const pseudonymize = (value: string | null | undefined): string | null => {
  if (!value) return null;
  return crypto.createHash('sha256').update(value).digest('hex');
};

const getSinceDateForRange = (timeRange: string): { since: Date; normalizedRange: '1h' | '24h' | '7d' | '30d' } => {
  const now = Date.now();
  switch (timeRange) {
    case '1h':
      return { since: new Date(now - 60 * 60 * 1000), normalizedRange: '1h' };
    case '7d':
      return { since: new Date(now - 7 * 24 * 60 * 60 * 1000), normalizedRange: '7d' };
    case '30d':
      return { since: new Date(now - 30 * 24 * 60 * 60 * 1000), normalizedRange: '30d' };
    case '24h':
    default:
      return { since: new Date(now - 24 * 60 * 60 * 1000), normalizedRange: '24h' };
  }
};

// Validation rules for error reports
export const errorReportValidation = [
  body('error.name').optional().isString().trim().isLength({ max: 255 }),
  body('error.message').isString().trim().isLength({ max: 2000 }),
  body('error.stack').optional().isString().trim().isLength({ max: 10000 }),
  body('errorInfo.componentStack').optional().isString().trim().isLength({ max: 5000 }),
  body('context.component').optional().isString().trim().isLength({ max: 255 }),
  body('context.level').optional().isIn(['page', 'section', 'component']),
  body('context.timestamp').isISO8601(),
  body('context.userAgent').optional().isString().trim().isLength({ max: 1000 }),
  body('context.url').optional().isURL().isLength({ max: 2000 }),
  body('errorId').optional().isString().trim().isLength({ max: 100 }),
];

/**
 * Report frontend errors to the backend
 * POST /api/errors/report
 */
export const reportError = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    error,
    errorInfo,
    context,
    errorId
  } = req.body;

  try {
    // Extract user information if available
    const userId = req.user?.id || null;
    const userEmail = req.user?.email || null;
    const ipAddress = req.ip || null;
    const userEmailHash = pseudonymize(userEmail);
    const ipAddressHash = pseudonymize(ipAddress);

    // Prepare error data for database
    const errorData = {
      error_id: errorId || `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error_name: error?.name || 'Unknown Error',
      error_message: error?.message || 'No error message provided',
      error_stack: error?.stack || null,
      component_stack: errorInfo?.componentStack || null,
      component_name: context?.component || null,
      error_level: context?.level || 'unknown',
      url: context?.url || null,
      user_agent: context?.userAgent || req.get('User-Agent') || null,
      user_id: userId,
      user_email: ENABLE_FULL_PII_LOGGING ? userEmail : null,
      ip_address: ENABLE_FULL_PII_LOGGING ? ipAddress : null,
      session_id: req.sessionID || null,
      timestamp: new Date(),
      metadata: {
        referer: req.get('Referer'),
        origin: req.get('Origin'),
        headers: {
          'accept-language': req.get('Accept-Language'),
          'accept-encoding': req.get('Accept-Encoding'),
        },
        piiMode: ENABLE_FULL_PII_LOGGING ? 'full' : 'pseudonymized',
        userEmailHash,
        ipAddressHash,
        context: context,
      }
    };

    // Insert error into database
    const query = `
      INSERT INTO frontend_errors (
        error_id, error_name, error_message, error_stack, component_stack,
        component_name, error_level, url, user_agent, user_id, user_email,
        ip_address, session_id, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id
    `;

    const result = await pool.query(query, [
      errorData.error_id,
      errorData.error_name,
      errorData.error_message,
      errorData.error_stack,
      errorData.component_stack,
      errorData.component_name,
      errorData.error_level,
      errorData.url,
      errorData.user_agent,
      errorData.user_id,
      errorData.user_email,
      errorData.ip_address,
      errorData.session_id,
      JSON.stringify(errorData.metadata),
      errorData.timestamp
    ]);

    // Log error for immediate attention if critical
    const logLevel = errorData.error_level === 'page' ? 'error' : 'warn';
    logger.log(logLevel, 'Frontend error reported:', {
      errorId: errorData.error_id,
      component: errorData.component_name,
      level: errorData.error_level,
      message: errorData.error_message,
      userId: userId || 'anonymous',
      url: errorData.url,
    });

    // Check for error patterns that need immediate attention
    await checkErrorPatterns(errorData);

    res.status(201).json({
      success: true,
      message: 'Error reported successfully',
      data: {
        errorId: errorData.error_id,
        reportId: result.rows[0].id,
      }
    });

  } catch (err) {
    logger.error('Failed to save frontend error report:', err);
    
    // Even if database save fails, we should still log the original error
    logger.error('Original frontend error (fallback logging):', {
      error,
      errorInfo,
      context,
      user: req.user?.id || 'anonymous',
    });

    res.status(500).json({
      success: false,
      message: 'Failed to process error report',
    });
  }
});

/**
 * Get error statistics and patterns
 * GET /api/errors/stats
 */
export const getErrorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const requestedRange = req.query.range as string || '24h';
  const { since, normalizedRange } = getSinceDateForRange(requestedRange);

  try {
    const queries = await Promise.all([
      // Total errors
      pool.query('SELECT COUNT(*) as total FROM frontend_errors WHERE created_at >= $1', [since]),
      
      // Errors by level
      pool.query(`
        SELECT error_level, COUNT(*) as count 
        FROM frontend_errors 
        WHERE created_at >= $1
        GROUP BY error_level 
        ORDER BY count DESC
      `, [since]),
      
      // Top error messages
      pool.query(`
        SELECT error_name, error_message, COUNT(*) as count 
        FROM frontend_errors 
        WHERE created_at >= $1
        GROUP BY error_name, error_message 
        ORDER BY count DESC 
        LIMIT 10
      `, [since]),
      
      // Errors by component
      pool.query(`
        SELECT component_name, COUNT(*) as count 
        FROM frontend_errors 
        WHERE created_at >= $1 AND component_name IS NOT NULL
        GROUP BY component_name 
        ORDER BY count DESC 
        LIMIT 10
      `, [since]),
      
      // Errors over time (hourly for last 24h)
      pool.query(`
        SELECT 
          DATE_TRUNC('hour', created_at) as hour,
          COUNT(*) as count
        FROM frontend_errors 
        WHERE created_at >= $1
        GROUP BY hour 
        ORDER BY hour DESC
        LIMIT 24
      `, [since])
    ]);

    res.json({
      success: true,
      data: {
        total: parseInt(queries[0].rows[0].total),
        byLevel: queries[1].rows,
        topErrors: queries[2].rows,
        byComponent: queries[3].rows,
        overTime: queries[4].rows,
        timeRange: normalizedRange
      }
    });
  } catch (err) {
    logger.error('Failed to fetch error stats:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch error stats',
    });
  }
});

/**
 * Check for error patterns that need immediate attention
 */
async function checkErrorPatterns(errorData: any) {
  try {
    // Check for error spikes (same error multiple times in short period)
    const recentSimilarErrors = await pool.query(`
      SELECT COUNT(*) as count
      FROM frontend_errors 
      WHERE error_message = $1 
        AND created_at >= NOW() - INTERVAL '5 minutes'
    `, [errorData.error_message]);

    const errorCount = parseInt(recentSimilarErrors.rows[0].count);
    
    if (errorCount >= 5) {
      logger.error('Frontend error spike detected:', {
        errorMessage: errorData.error_message,
        count: errorCount,
        timeWindow: '5 minutes'
      });
      
      // Could trigger alerts/notifications here
      // await notifyErrorSpike(errorData, errorCount);
    }

    // Check for critical page errors
    if (errorData.error_level === 'page') {
      logger.error('Critical page error detected:', {
        errorId: errorData.error_id,
        component: errorData.component_name,
        url: errorData.url,
        message: errorData.error_message,
      });
      
      // Could trigger immediate alerts for page-level errors
      // await notifyCriticalError(errorData);
    }

  } catch (err) {
    logger.error('Error pattern analysis failed:', err);
  }
}

/**
 * Clear old error logs (cleanup job)
 * DELETE /api/errors/cleanup
 */
export const cleanupOldErrors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsedDays = Number.parseInt(String(req.query.days ?? DEFAULT_RETENTION_DAYS), 10);
  if (!Number.isInteger(parsedDays) || parsedDays < 1 || parsedDays > MAX_RETENTION_DAYS) {
    res.status(400).json({
      success: false,
      message: `days must be an integer between 1 and ${MAX_RETENTION_DAYS}`,
    });
    return;
  }

  const retentionDays = parsedDays;

  try {
    const result = await pool.query(`
      DELETE FROM frontend_errors 
      WHERE created_at < NOW() - make_interval(days => $1)
    `, [retentionDays]);

    logger.info(`Cleaned up ${result.rowCount} old frontend error records`);

    res.json({
      success: true,
      message: `Cleaned up ${result.rowCount} error records older than ${retentionDays} days`
    });
  } catch (err) {
    logger.error('Failed to cleanup old frontend errors:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old errors',
    });
  }
});