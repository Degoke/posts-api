// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getConfig } from '../config'
import { AuthenticationError } from '../errors/errors'

/**
 * Authenticates a token sent in the request headers.
 *
 * @param req - The request object containing information about the incoming request.
 * @param res - The response object used to send the response back to the client.
 * @param next - The next function in the middleware chain.
 * @returns A promise that resolves when the token authentication is successful and rejects when an error occurs.
 */
export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    return authenticateTokenImpl(req, res).then(next).catch(next)
}

/**
 * Authenticates a token sent in the request headers.
 * It verifies the token using a secret key and sets the decoded user information in the response locals.
 *
 * @param req - The request object containing the headers with the authorization token.
 * @param res - The response object where the decoded user information will be stored.
 * @throws {AuthenticationError} If the token type or token is missing, or if an error occurs during the verification process.
 */
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
