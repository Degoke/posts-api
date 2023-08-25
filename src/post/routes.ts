import { Router } from 'express'
import { authenticateToken } from '../auth/middleware'
import { asyncWrap } from '../async'
import { addCommentToPostHandler, newCommentValidator } from './comment'
import { seedPostsHandler } from './seed'

export const postsRouter = Router()

postsRouter.use('/seed', seedPostsHandler)
postsRouter.use(authenticateToken)
postsRouter.post(
    '/:postId/comments',
    newCommentValidator,
    asyncWrap(addCommentToPostHandler)
)
