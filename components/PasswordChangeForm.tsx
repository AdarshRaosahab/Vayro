import { useState } from 'react'
import { Card } from './Card'
import { Input } from './Input'
import { ButtonPrimary } from './ButtonPrimary'
import Alert from './Alert'

export const PasswordChangeForm = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'New password must be at least 8 characters long' })
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update password')

            setMessage({ type: 'success', text: 'Password updated successfully' })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Security</h2>

            {message && (
                <div className="mb-4">
                    <Alert type={message.type} message={message.text} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div className="pt-2">
                    <ButtonPrimary type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </ButtonPrimary>
                </div>
            </form>
        </Card>
    )
}
