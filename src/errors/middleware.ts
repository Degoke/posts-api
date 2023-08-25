import { NextFunction, Request, Response } from 'express'
import { logger } from '../logger'
import { isProduction } from '../config'

export const notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).send({
        status: 'error',
        message: 'endpoint not found',
    })
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err)
    }
    switch (err.name) {
        case 'ServiceError':
            logger.error(err)
            return res.status(400).send({
                status: 'error',
                message: err.message,
            })
        case 'NotFoundError':
            logger.error(err)
            return res.status(404).send({
                status: 'error',
                message: err.message,
            })
        case 'ValidationError':
            logger.error(err)
            return res.status(422).send({
                status: 'error',
                message: err.message,
                errors: err.errors,
            })
        case 'AuthenticationError':
            logger.error(err)
            return res.status(401).send({
                status: 'error',
                message: err.message,
            })
        case 'AuthorizationError':
            logger.error(err)
            return res.status(403).send({
                status: 'error',
                message: err.message,
            })
        default:
            logger.error(err)
            return res.status(500).send({
                status: 'error',
                message: 'an error occurred',
                ...(isProduction()
                    ? {}
                    : { error: err.message || err.toString() }),
            })
    }
}
