import { Response, Request } from 'express'
import { seedUsersPostsAndComments } from '../utils'

/**
 * Handles a request to seed users, posts, and comments.
 *
 * @param req - The request object containing information about the HTTP request.
 * @param res - The response object used to send the HTTP response to the client.
 * @throws Throws an error if an error occurs during the seeding operation.
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
