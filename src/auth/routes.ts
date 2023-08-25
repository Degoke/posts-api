import { Router } from "express";
import { getRateLimiter } from "../ratelimit";
import { loginHandler, loginValidators } from "./login";
import { newUserHandler, newUserValidators } from "./newUser";
import { asyncWrap } from "../async";

export const authRouter = Router()

// authRouter.use(getRateLimiter)
authRouter.post('/login', loginValidators, asyncWrap(loginHandler))
authRouter.post('/newUser', newUserValidators, asyncWrap(newUserHandler))