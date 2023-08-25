import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { comparePasswords, generateToken } from './utils'
import { getUserByEmail } from '../user/repo'
import { AuthenticationError, ValidationError } from '../errors/errors'
import { User } from '../models/User'

export const loginValidators = [
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Invalid password, must be at least 5 characters'),
]

export async function loginHandler(req: Request, res: Response): Promise<void> {
    /**
     * Handles the login request.
     *
     * @param req - The request object containing the login details in the request body.
     * @param res - The response object used to send the HTTP response.
     * @returns void
     */
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError(errors as any)
    }

    const { email, password } = req.body

    try {
        const { token, user } = await tryLogin(email, password, res)
        res.status(200).json({ token, user })
    } catch (error) {
        throw error
    }
}
export async function tryLogin(email: string, password: string, res: Response) {
    let user
    try {
        user = await getUserByEmail(email)
    } catch (error) {
        throw error
    }

    if (!user) {
        throw new AuthenticationError('Email or password is invalid')
    }

    const passwordMatches = await comparePasswords(password, user.password)
    if (!passwordMatches) {
        throw new AuthenticationError('Email or password is invalid')
    }

    const token = generateToken(user)

    delete (user as Partial<User>).password
    return { token, user }
}
