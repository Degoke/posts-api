"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.NotFoundError = exports.ServiceError = exports.GenericError = void 0;
class GenericError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.GenericError = GenericError;
class ServiceError extends GenericError {
    constructor(message) {
        super(message);
    }
}
exports.ServiceError = ServiceError;
class NotFoundError extends GenericError {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends GenericError {
    constructor(errors = [], message = '') {
        super(message);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends GenericError {
    constructor(message) {
        super(message);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends GenericError {
    constructor(message = 'you are not authorized to perform this action') {
        super(message);
    }
}
exports.AuthorizationError = AuthorizationError;
//# sourceMappingURL=errors.js.map