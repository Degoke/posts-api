import { Request, Response } from 'express'
import { createPostComment, getPostById } from './repo'
import { body, validationResult } from 'express-validator'
import { isUUID } from '../utils'
import { randomUUID } from 'crypto'
import { ServiceError, ValidationError } from '../errors/errors'

export const newCommentValidator = [
    body('content').notEmpty().withMessage('Valid Content is required'),
]

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function addCommentToPostHandler(
    req: Request,
    res: Response
): Promise<void> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError(errors as any)
    }

    const postId = req.params.postId
    if (!isUUID(postId)) {
        throw new ServiceError('Invalid Post Id')
    }

    const userId = res.locals.user.id
    if (!userId) {
        throw new ServiceError('Forbidden')
    }

    const { content } = req.body

    let postExists
    try {
        postExists = await getPostById(postId)

        if (!postExists) {
            throw new ServiceError('Invalid Post Id')
        }

        const comment = await createPostComment({
            id: randomUUID(),
            post_id: postId,
            user_id: userId,
            content,
        })
        res.status(201).json({ comment })
        return
    } catch (error) {
        throw error
    }
}
