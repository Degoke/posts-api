import { Request, Response } from 'express'
import { getAllUsers, getTopUsersWithMostPosts } from './repo'

/**
 * Handles the request to get all users.
 *
 * @param req - The request object containing information about the HTTP request.
 * @param res - The response object used to send the HTTP response.
 * @throws Throws an error if there is an error retrieving the users.
 */
export async function allUsersHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const users = await getAllUsers()
        res.status(200).json({ users })
        return
    } catch (error) {
        throw error
    }
}

/**
 * Handles a request to get the top users with the most posts.
 * Calls the getTopUsersWithMostPosts function to retrieve the users and sends the response with the users in JSON format.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send the response back to the client.
 */
export async function topUsersHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const users = await getTopUsersWithMostPosts(3)
        console.log(users)
        res.status(200).json({ users })
        return
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
        return
    }
}
