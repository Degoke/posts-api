import { Request, Response } from 'express';
import { getAllUsers } from './repo';

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function allUsersHandler(req: Request, res: Response): Promise<void> {
    try {
        console.log("gettingUsers")
      const users = await getAllUsers();
      console.log(users)
      res.status(200).json({ users });
      return
    } catch (err) {
      res.status(500).json({ "message": err })
      return
    }
  }