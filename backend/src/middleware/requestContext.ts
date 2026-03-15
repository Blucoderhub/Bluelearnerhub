import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const REQUEST_ID_HEADER = 'x-request-id';

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  const incoming = req.header(REQUEST_ID_HEADER);
  const requestId = (incoming && incoming.trim()) || randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
};
