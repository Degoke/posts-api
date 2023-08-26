import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getConfig } from '../config'
import { User } from '../models/User'
/**
 * Hashes a given password using the bcrypt library.
 *
 * @param password - The password to be hashed.
 * @returns A Promise that resolves to a string representing the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

/**
 * Compares a plain text password with its hashed version.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed version of the password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the passwords match.
 */
export const comparePasswords = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param user - The user object for which the token needs to be generated.
 * @returns The generated JSON Web Token for the given user.
 */
export const generateToken = (user: User): string => {
    const secret = getConfig().serverSecret
    return jwt.sign({ user }, secret, { expiresIn: '1h' }) // Token expires in 1 hour
}
