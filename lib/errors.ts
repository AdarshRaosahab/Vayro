export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this)
    }
}

export class AuthError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401)
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Invalid input data') {
        super(message, 400)
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later') {
        super(message, 429)
    }
}

export class PaymentError extends AppError {
    constructor(message = 'Payment processing failed') {
        super(message, 402)
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}

export function formatError(err: any) {
    if (err instanceof AppError) {
        return {
            ok: false,
            error: err.message,
            code: err.constructor.name,
        }
    }

    // Handle generic errors
    return {
        ok: false,
        error: 'An unexpected error occurred',
        code: 'InternalServerError',
    }
}
