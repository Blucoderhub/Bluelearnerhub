import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
