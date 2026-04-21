/// <reference types="express" />

/**
 * Extends Express's Request interface globally so req.user and req.requestId
 * are fully typed across all controllers and middleware without (req as any) casts.
 *
 * Compatible with Express v5 + @types/express v5
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Set by the `authenticate` middleware after validating the JWT.
       * Undefined on routes using `optionalAuth` where no token is provided.
       */
      user?: {
        id: number;
        email: string;
        fullName: string;
        role?: 'STUDENT' | 'CORPORATE' | 'MENTOR' | 'ADMIN';
        domain?: string;
        level?: number;
        isActive?: boolean;
      };

      /**
       * Set by requestContext middleware — unique ID for log correlation.
       * Always present after requestContext middleware runs.
       */
      requestId?: string;

      /**
       * Alias for requestId — legacy name.
       * @deprecated Use requestId instead
       */
      correlationId?: string;

      /**
       * Express Session ID (set by express-session if used).
       */
      sessionID?: string;

      /**
       * Request timestamp for performance tracking
       */
      requestTime?: Date;
    }
  }
}

/**
 * Re-export to make this a module augmentation
 */
export {};
