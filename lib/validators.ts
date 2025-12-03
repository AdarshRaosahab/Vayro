import { ValidationError } from './errors'

export function validateEmail(email: any): string {
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ValidationError('Invalid email address')
    }
    return email.trim().toLowerCase()
}

export function validatePassword(password: any): string {
    if (!password || typeof password !== 'string' || password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long')
    }
    return password
}

export function validateAlias(alias: any): string {
    if (!alias || typeof alias !== 'string' || !/^[a-zA-Z0-9-_]+$/.test(alias)) {
        throw new ValidationError('Alias can only contain letters, numbers, hyphens, and underscores')
    }
    return alias.trim()
}

export function validateURL(url: any): string {
    try {
        const parsed = new URL(url)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error()
        }
        return url.trim()
    } catch {
        throw new ValidationError('Invalid URL. Must start with http:// or https://')
    }
}
