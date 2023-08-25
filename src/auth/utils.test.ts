import { hashPassword, comparePasswords } from './utils'

describe('hashPassword', () => {
    // Tests that the function returns a hashed password string when given a valid password string
    it('should return a hashed password string when given a valid password string', async () => {
        const password = 'validPassword'
        const hashedPassword = await hashPassword(password)
        expect(typeof hashedPassword).toBe('string')
    })

    // Tests that the function returns a hashed password string that is not equal to the input password string
    it('should return a hashed password string that is not equal to the input password string', async () => {
        const password = 'password'
        const hashedPassword = await hashPassword(password)
        expect(hashedPassword).not.toBe(password)
    })
})

describe('comparePasswords', () => {
    // Tests that comparePasswords returns true when comparing a password with its hashed version
    it('should return true when comparing a password with its hashed version', async () => {
        const password = 'password123'
        const hashedPassword = await hashPassword(password)
        const result = await comparePasswords(password, hashedPassword)
        expect(result).toBe(true)
    })

    // Tests that comparePasswords handles passwords with special characters
    it('should handle passwords with special characters', async () => {
        const password = 'password!@#$%^&*'
        const hashedPassword = await hashPassword(password)
        const result = await comparePasswords(password, hashedPassword)
        expect(result).toBe(true)
    })

    // Tests that comparePasswords returns false when comparing a password with a different hashed password
    it('should return false when comparing a password with a different hashed password', async () => {
        const password = 'password123'
        const hashedPassword1 = await hashPassword(password)
        const hashedPassword2 = await hashPassword('differentpassword')
        const result = await comparePasswords(password, hashedPassword2)
        expect(result).toBe(false)
    })
})
