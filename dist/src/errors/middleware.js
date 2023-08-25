"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const logger_1 = require("../logger");
const config_1 = require("../config");
const notFoundHandler = (req, res) => {
    return res.status(404).send({
        status: 'error',
        message: 'endpoint not found',
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    switch (err.name) {
        case 'ServiceError':
            logger_1.logger.error(err);
            return res.status(400).send({
                status: 'error',
                message: err.message,
            });
        case 'NotFoundError':
            logger_1.logger.error(err);
            return res.status(404).send({
                status: 'error',
                message: err.message,
            });
        case 'ValidationError':
            logger_1.logger.error(err);
            return res.status(422).send({
                status: 'error',
                message: err.message,
                errors: err.errors,
            });
        case 'AuthenticationError':
            logger_1.logger.error(err);
            return res.status(401).send({
                status: 'error',
                message: err.message,
            });
        case 'AuthorizationError':
            logger_1.logger.error(err);
            return res.status(403).send({
                status: 'error',
                message: err.message,
            });
        default:
            logger_1.logger.error(err);
            return res.status(500).send(Object.assign({ status: 'error', message: 'an error occurred' }, ((0, config_1.isProduction)()
                ? {}
                : { error: err.message || err.toString() })));
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map