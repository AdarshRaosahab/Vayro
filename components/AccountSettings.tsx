import { useState } from 'react'
import { Card } from './Card'
import { Input } from './Input'
import { ButtonPrimary } from './ButtonPrimary'
import Alert from './Alert'

interface Props {
    user: {
        displayName?: string
        email: string
        website?: string
    }
}

export const AccountSettings = ({ user }: Props) => {
    const [displayName, setDisplayName] = useState(user.displayName || '')
    const [website, setWebsite] = useState(user.website || '')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName, website }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update profile')

            setMessage({ type: 'success', text: 'Profile updated successfully' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Account Settings</h2>

            {message && (
                <div className="mb-4">
                    <Alert type={message.type} message={message.text} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <Input
                        type="email"
                        value={user.email}
                        disabled
                        className="bg-slate-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <Input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                    <Input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>

                <div className="pt-2">
                    <ButtonPrimary type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </ButtonPrimary>
                </div>
            </form>
        </Card>
    )
}
