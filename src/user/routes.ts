import { Router } from "express";
import { getRateLimiter } from "../ratelimit";
import { authenticateToken } from "../auth/middleware";
import { allUsersHandler } from "./allUsers";
import { asyncWrap } from "../async";

export const userRouter = Router()

userRouter.use(authenticateToken)
userRouter.get('/', asyncWrap(allUsersHandler))