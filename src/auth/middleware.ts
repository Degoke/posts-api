// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config';
import { User } from '../models/User';

export function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    return authenticateTokenImpl(req, res).then(next).catch(next);
  }
  
  export async function authenticateTokenImpl(req: Request, res: Response): Promise<void> {
    console.log('iddleware')
    const secret = getConfig().serverSecret
    console.log("secret", secret)
    const [tokenType, token] = req.headers.authorization?.split(' ') ?? [];
    if (!tokenType || !token) {
      res.status(403).json({ message: 'forbidden' })
      return
    }
    const decoded = jwt.verify(token, secret) as any;
  
    res.locals.user = decoded.user
  }
