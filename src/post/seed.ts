import { Response, Request } from 'express'
import { seedUsersPostsAndComments } from '../utils'

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function seedPostsHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        await seedUsersPostsAndComments()
        res.status(201).json({ message: 'success' })
        return
    } catch (error) {
        throw error
    }
}
