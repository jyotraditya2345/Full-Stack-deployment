import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

export const createJwt = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, env.jwtSecret) as JwtPayload;
