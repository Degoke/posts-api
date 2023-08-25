import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pwnedPassword } from 'hibp';
import { logger } from '../logger';
import { User } from '../models/User';
import { tryLogin } from './login';
import { hashPassword } from './utils';
import { getUserByEmail, createUser } from '../user/repo';
import { randomUUID } from 'crypto';

export const newUserValidators = [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email address is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function newUserHandler(req: Request, res: Response): Promise<void> {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors)
    return;
  }

  const email = req.body.email.toLowerCase();
  let existingUser = undefined;

  console.log("starting")
existingUser = await getUserByEmail(email)
console.log(existingUser)
  if (existingUser) {
    res.status(400).json({ message: 'Email already registered' });
    return;
  }

  try {
    const { email, password, firstname, lastname } = req.body;


  const numPwns = await pwnedPassword(password);
  if (numPwns > 0) {
    res.status(400).json({ message: "Password found in breach database" });
    return;
  }

  const passwordHash = await hashPassword(password);
  await createUser({ firstname, lastname, email, password: passwordHash, id: randomUUID() })

    const token = await tryLogin(email, req.body.password, res);
    console.log(token)
    res.status(201).json({ token });
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}
