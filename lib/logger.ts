export function logError(err: any, context?: string) {
    const timestamp = new Date().toISOString()
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    const ctx = context ? `[${context}]` : ''

    // In production, you might send this to Sentry, Datadog, etc.
    console.error(`[${timestamp}] [ERROR] ${ctx} ${message}`)
    if (stack) {
        console.error(stack)
    }
}

export function logInfo(message: string, context?: string) {
    const timestamp = new Date().toISOString()
    const ctx = context ? `[${context}]` : ''
    console.log(`[${timestamp}] [INFO] ${ctx} ${message}`)
}
