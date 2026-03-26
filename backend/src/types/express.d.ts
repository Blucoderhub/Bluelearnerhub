/**
 * Extends Express's Request interface globally so req.user and req.correlationId
 * are fully typed across all controllers and middleware without (req as any) casts.
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
        role: string;
        fullName: string;
      };
      /** Set by requestContext middleware — unique ID for log correlation. */
      correlationId?: string;
      /** Alias for correlationId — used by legacy middleware and error handlers. */
      requestId?: string;
      /** Express Session ID (set by express-session if used). */
      sessionID?: string;
    }
  }
}

export {};
