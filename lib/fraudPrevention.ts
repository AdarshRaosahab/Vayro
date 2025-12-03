
const SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'update-account', 'secure', 'banking', 'wallet',
    'crypto', 'bitcoin', 'ethereum', 'binance', 'coinbase', 'trustwallet', 'metamask',
    'paypal', 'venmo', 'cashapp', 'western-union',
    'prize', 'winner', 'lottery', 'giveaway', 'free-money', 'claim-reward',
    'gift-card', 'voucher', 'coupon',
    'support', 'helpdesk', 'customer-service',
    'irs', 'tax', 'refund', 'gov',
    'whatsapp-group', 'telegram-group',
    'invest', 'trading', 'forex', 'profit', 'doubler'
]

const BLOCKED_DOMAINS = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co', 'is.gd', 'buff.ly',
    'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'bc.vc', 'sh.st'
]

export const fraudPrevention = {
    isSuspicious(url: string): { isSuspicious: boolean; reason?: string } {
        const lowerUrl = url.toLowerCase()

        // 1. Check for double shortening (blocking known shorteners)
        try {
            const hostname = new URL(url).hostname.replace('www.', '')
            if (BLOCKED_DOMAINS.includes(hostname)) {
                return { isSuspicious: true, reason: 'Double-shortening is not allowed. Please use the original link.' }
            }
        } catch (e) {
            // Invalid URL format, let validator handle it or block it
            return { isSuspicious: true, reason: 'Invalid URL format.' }
        }

        // 2. Check for suspicious keywords
        for (const keyword of SUSPICIOUS_KEYWORDS) {
            if (lowerUrl.includes(keyword)) {
                return { isSuspicious: true, reason: `URL contains suspicious keyword: "${keyword}".` }
            }
        }

        return { isSuspicious: false }
    }
}
