export class GenericError extends Error {
    constructor(message: any) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ServiceError extends GenericError {
    constructor(message: any) {
        super(message)
    }
}

export class NotFoundError extends GenericError {
    constructor(message: any) {
        super(message)
    }
}

export class ValidationError extends GenericError {
    public errors: any[]
    constructor(errors: any[] = [], message = '') {
        super(message)
        this.errors = errors
    }
}

export class AuthenticationError extends GenericError {
    constructor(message: any) {
        super(message)
    }
}

export class AuthorizationError extends GenericError {
    constructor(message = 'you are not authorized to perform this action') {
        super(message)
    }
}
