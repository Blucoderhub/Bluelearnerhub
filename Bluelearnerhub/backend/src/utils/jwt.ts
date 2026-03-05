import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: number;
  email?: string;
  role?: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload as object, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload as object, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn } as any);
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
};
