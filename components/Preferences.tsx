import { useState } from 'react'
import { Card } from './Card'
import { ButtonPrimary } from './ButtonPrimary'
import Alert from './Alert'

interface Props {
    user: {
        marketingEmails?: boolean
    }
}

export const Preferences = ({ user }: Props) => {
    const [marketingEmails, setMarketingEmails] = useState(user.marketingEmails ?? true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const res = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ marketingEmails }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update preferences')

            setMessage({ type: 'success', text: 'Preferences updated successfully' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Preferences</h2>

            {message && (
                <div className="mb-4">
                    <Alert type={message.type} message={message.text} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="marketingEmails" className="block text-sm font-medium text-slate-900">
                            Marketing Emails
                        </label>
                        <p className="text-sm text-slate-500">Receive updates about new features and promotions.</p>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="marketingEmails"
                            type="checkbox"
                            checked={marketingEmails}
                            onChange={(e) => setMarketingEmails(e.target.checked)}
                            className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-slate-300 rounded"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <ButtonPrimary type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Preferences'}
                    </ButtonPrimary>
                </div>
            </form>
        </Card>
    )
}
