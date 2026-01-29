import { randomInt } from 'crypto'

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE = ALPHABET.length

export function generateShortCode(length: number = 6): string {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += ALPHABET[randomInt(BASE)]
    }
    return result
}
