import { Router } from 'express'
import { loginHandler, loginValidators } from './login'
import { newUserHandler, newUserValidators } from './newuser'
import { asyncWrap } from '../async'

export const authRouter = Router()

authRouter.post('/login', loginValidators, asyncWrap(loginHandler))
authRouter.post('/newUser', newUserValidators, asyncWrap(newUserHandler))
