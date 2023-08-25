import { Request, Response } from 'express'
import { getAllUsers, getTopUsersWithMostPosts } from './repo'

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
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
