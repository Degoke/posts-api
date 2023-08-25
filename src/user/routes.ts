import { Router } from 'express'
import { authenticateToken } from '../auth/middleware'
import { allUsersHandler, topUsersHandler } from './user'
import { asyncWrap } from '../async'
import { createPostHandler, getPostsHandler, newPostValidators } from './post'

export const usersRouter = Router()

usersRouter.get('/topusers', asyncWrap(topUsersHandler))
usersRouter.get('/', asyncWrap(allUsersHandler))
usersRouter.use(authenticateToken)
usersRouter.get('/:id/posts', asyncWrap(getPostsHandler))
usersRouter.post('/:id/posts', newPostValidators, asyncWrap(createPostHandler))
