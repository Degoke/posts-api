import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { pwnedPassword } from 'hibp'
import { User } from '../models/User'
import { tryLogin } from './login'
import { hashPassword } from './utils'
import { getUserByEmail, createUser } from '../user/repo'
import { randomUUID } from 'crypto'
import { ValidationError, ServiceError } from '../errors/errors'

export const newUserValidators = [
    body('name').notEmpty().withMessage('Valid Name is required'),
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
]

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function newUserHandler(
    req: Request,
    res: Response
): Promise<void> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError(errors as any)
    }

    const email = req.body.email.toLowerCase()
    let existingUser = undefined

    existingUser = await getUserByEmail(email)
    if (existingUser) {
        throw new ServiceError('Email already registered')
    }

    try {
        const { email, password, name } = req.body

        const numPwns = await pwnedPassword(password)
        if (numPwns > 0) {
            throw new ServiceError(
                'Password found in breach database: use a stronger psssword'
            )
        }

        const passwordHash = await hashPassword(password)
        const user: Partial<User> = await createUser({
            name,
            email,
            password: passwordHash,
            id: randomUUID(),
        })

        const token = await tryLogin(email, req.body.password, res)

        delete user.password
        res.status(201).json({ user, token })
    } catch (error) {
        throw error
    }
}
