const http = require('http')

const TARGET_URL = 'http://localhost:3000'
const CONCURRENCY = 10
const TOTAL_REQUESTS = 100

let completed = 0
let success = 0
let fail = 0
const start = Date.now()

function makeRequest() {
    if (completed >= TOTAL_REQUESTS) return

    http.get(TARGET_URL, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
            success++
        } else {
            fail++
        }
        completed++
        if (completed === TOTAL_REQUESTS) {
            finish()
        } else {
            makeRequest()
        }
    }).on('error', (e) => {
        fail++
        completed++
        if (completed === TOTAL_REQUESTS) finish()
        else makeRequest()
    })
}

function finish() {
    const duration = (Date.now() - start) / 1000
    console.log('--- Performance Test Results ---')
    console.log(`Total Requests: ${TOTAL_REQUESTS}`)
    console.log(`Concurrency: ${CONCURRENCY}`)
    console.log(`Duration: ${duration.toFixed(2)}s`)
    console.log(`RPS: ${(TOTAL_REQUESTS / duration).toFixed(2)}`)
    console.log(`Success: ${success}`)
    console.log(`Fail: ${fail}`)
}

console.log(`Starting load test on ${TARGET_URL}...`)
for (let i = 0; i < CONCURRENCY; i++) {
    makeRequest()
}
