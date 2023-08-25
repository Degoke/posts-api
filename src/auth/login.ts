import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { comparePasswords, generateToken } from './utils';
import { getUserByEmail } from '../user/repo';

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email address is required'),
  body('password').isLength({ min: 5 }).withMessage('Invalid password, must be at least 5 characters'),
];

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
    return;
  }

  const { email, password } = req.body;

  try {
    const token = await tryLogin(email, password, res)
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
 export async function tryLogin (email: string, password: string, res: Response){
    let user;
    try {
        user = await getUserByEmail(email);
    } catch (err) {
        throw err
    } 
    
    if (!user) {
        res.status(401).json({ message: 'Authentication failed' });
        return
    }

    const passwordMatches = await comparePasswords(password, user.password);
    if (!passwordMatches) {
       res.status(401).json({ message: 'Authentication failed' });
       return
    }

    const token = generateToken(user);
    return token
}