import { Request, Response } from 'express'
import {
    createUserPost,
    getAllUsers,
    getPostByTitle,
    getUserByEmail,
    getUserById,
    getUserPosts,
} from './repo'
import { body, validationResult } from 'express-validator'
import { isUUID } from '../utils'
import { randomUUID } from 'crypto'
import {
    ValidationError,
    ServiceError,
    AuthorizationError,
} from '../errors/errors'

export const newPostValidators = [
    body('title').notEmpty().withMessage('Valid Title is required'),
    body('content').notEmpty().withMessage('Valid Content is required'),
]

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function createPostHandler(
    req: Request,
    res: Response
): Promise<void> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError(errors as any)
    }

    const userId = req.params.id
    if (!isUUID(userId)) {
        throw new ServiceError('Invalid User Id')
    }

    if (userId !== res.locals.user.id) {
        throw new AuthorizationError('Forbidden')
    }

    const { title, content } = req.body

    let userExists
    let existingTitle = undefined
    try {
        userExists = await getUserById(userId)

        if (!userExists) {
            throw new ServiceError('Invalid User Id')
        }

        existingTitle = await getPostByTitle(userId, title)

        if (existingTitle) {
            throw new ServiceError('Title already Exists')
        }

        const post = await createUserPost({
            id: randomUUID(),
            user_id: userId,
            title,
            content,
        })
        res.status(201).json({ post })
        return
    } catch (error) {
        throw error
    }
}

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function getPostsHandler(
    req: Request,
    res: Response
): Promise<void> {
    const userId = req.params.id
    if (!isUUID(userId)) {
        throw new ServiceError('Invalid User Id')
    }

    if (userId !== res.locals.user.id) {
        throw new AuthorizationError('Forbidden')
    }

    try {
        const posts = await getUserPosts(userId)
        res.status(200).json({ posts })
        return
    } catch (error) {
        throw error
    }
}
