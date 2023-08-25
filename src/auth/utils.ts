import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getConfig } from '../config'
import { User } from '../models/User'
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

export const comparePasswords = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user: User): string => {
    const secret = getConfig().serverSecret
    return jwt.sign({ user }, secret, { expiresIn: '1h' }) // Token expires in 1 hour
}
