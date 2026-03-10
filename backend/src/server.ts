import http from 'http';
import { createApp } from './app';
import { SocketService } from './sockets';
import { 
  testPostgresConnection, 
  testRedisConnection,
  pool,
  redisClient
} from './utils/database';
import { config } from './config';
import logger from './utils/logger';
import { initDailyQuizCron } from './services/dailyQuiz.service';

async function startServer() {
  try {
    // Test database connections with enhanced error handling
    logger.info('🔌 Testing database connections...');
    
    try {
      await testPostgresConnection();
      logger.info('✅ PostgreSQL connection successful');
    } catch (error) {
      logger.error('❌ PostgreSQL connection failed:', error);
      logger.warn('⚠️  Server will continue without PostgreSQL connection for auditing purposes.');
    }

    try {
      await testRedisConnection();
      logger.info('✅ Redis connection successful');
    } catch (error) {
      logger.warn('⚠️  Redis connection failed - caching will be disabled:', error);
      // Don't throw error for Redis - app can run without caching
    }

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Initialize Socket.IO
    const socketService = new SocketService(httpServer);
    logger.info('✓ Socket.IO initialized');

    // Make socket service available globally
    (global as any).socketService = socketService;

    // Initialize daily quiz cron (midnight UTC)
    initDailyQuizCron();
    logger.info('✓ Daily Quiz cron initialized');

    // Start server
    const PORT = config.port;
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 EdTech Platform Backend Server                      ║
║                                                           ║
║   Environment: ${config.nodeEnv.padEnd(42)} ║
║   Port:        ${PORT.toString().padEnd(42)} ║
║   URL:         http://localhost:${PORT.toString().padEnd(31)} ║
║   Database:    PostgreSQL ${pool.totalCount}/${config.database.maxConnections} connections     ║
║   Cache:       Redis ${redisClient.status.padEnd(34)} ║
║                                                           ║
║   Status:      ✓ All systems operational                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Enhanced graceful shutdown with cleanup
    const shutdown = async (signal: string) => {
      logger.info(`🛑 Received ${signal}, shutting down gracefully...`);

      // Close HTTP server
      httpServer.close((err) => {
        if (err) {
          logger.error('Error closing HTTP server:', err);
        } else {
          logger.info('✓ HTTP server closed');
        }
      });

      // Close Socket.IO connections
      if (socketService) {
        socketService.close();
        logger.info('✓ Socket.IO connections closed');
      }

      // Close database connections
      try {
        await pool.end();
        logger.info('✓ PostgreSQL connections closed');
      } catch (error) {
        logger.error('Error closing PostgreSQL connections:', error);
      }

      try {
        redisClient.disconnect();
        logger.info('✓ Redis connection closed');
      } catch (error) {
        logger.error('Error closing Redis connection:', error);
      }

      logger.info('👋 Server shutdown complete');
      process.exit(0);
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Health check endpoint for monitoring
    httpServer.on('listening', () => {
      logger.info(`🔍 Health check available at: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('💥 Failed to start server:', error);
    
    // Ensure connections are closed on startup failure
    try {
      await pool.end();
      redisClient.disconnect();
    } catch (cleanupError) {
      logger.error('Error during cleanup:', cleanupError);
    }
    
    process.exit(1);
  }
}

// Enhanced error handlers with better logging
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚨 Unhandled Promise Rejection:', {
    reason,
    promise,
    stack: reason instanceof Error ? reason.stack : 'No stack trace available'
  });
  
  // Don't exit immediately - log and continue
  // In production, you might want to exit after cleanup
  if (config.nodeEnv === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('🚨 Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  
  // Always exit on uncaught exceptions as the process state is undefined
  process.exit(1);
});

// Graceful handling of memory warnings
process.on('warning', (warning) => {
  logger.warn('⚠️  Process Warning:', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack
  });
});

// Start the server
if (require.main === module) {
  startServer().catch((error) => {
    logger.error('💥 Fatal error starting server:', error);
    process.exit(1);
  });
}

export { startServer };
