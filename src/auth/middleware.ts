// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getConfig } from '../config'
import { AuthenticationError } from '../errors/errors'

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    return authenticateTokenImpl(req, res).then(next).catch(next)
}

export async function authenticateTokenImpl(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const secret = getConfig().serverSecret
        const [tokenType, token] = req.headers.authorization?.split(' ') ?? []
        if (!tokenType || !token) {
            throw new AuthenticationError('Unauthorized')
        }
        const decoded = jwt.verify(token, secret) as any

        res.locals.user = decoded.user
    } catch (error) {
        throw new AuthenticationError(error)
    }
}
