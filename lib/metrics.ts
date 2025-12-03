// Simple observability helper.
// In production, connect this to Datadog, Prometheus, or similar.

export const metrics = {
    incrementCounter(name: string, tags: Record<string, string> = {}) {
        const tagString = Object.entries(tags).map(([k, v]) => `${k}:${v}`).join(',')
        if (process.env.METRICS_BACKEND) {
            // Send to backend
            console.log(`[METRIC] COUNTER ${name} 1 ${tagString}`)
        } else {
            // Log locally for dev
            // console.log(`[METRIC] ${name} +1 ${tagString}`)
        }
    },

    gauge(name: string, value: number, tags: Record<string, string> = {}) {
        const tagString = Object.entries(tags).map(([k, v]) => `${k}:${v}`).join(',')
        if (process.env.METRICS_BACKEND) {
            console.log(`[METRIC] GAUGE ${name} ${value} ${tagString}`)
        }
    },

    timing(name: string, ms: number, tags: Record<string, string> = {}) {
        const tagString = Object.entries(tags).map(([k, v]) => `${k}:${v}`).join(',')
        if (process.env.METRICS_BACKEND) {
            console.log(`[METRIC] TIMING ${name} ${ms}ms ${tagString}`)
        }
    }
}
