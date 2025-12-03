import { useState, useEffect } from 'react'
import { Card } from './Card'
import { ButtonPrimary } from './ButtonPrimary'
import PremiumBadge from './PremiumBadge'
import Alert from './Alert'

interface Props {
    user: {
        plan: string
        role?: string
    }
}

interface Invoice {
    id: string
    date: string
    amount: number
    currency: string
    status: string
    downloadUrl: string
}

export const BillingStatus = ({ user }: Props) => {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [cancelLoading, setCancelLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetch('/api/user/invoices')
            .then(res => res.json())
            .then(data => {
                if (data.ok) setInvoices(data.invoices)
            })
            .catch(err => console.error('Failed to fetch invoices', err))
    }, [])

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing cycle.')) return

        setCancelLoading(true)
        setMessage(null)

        try {
            const res = await fetch('/api/user/subscription/cancel', {
                method: 'POST',
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to cancel subscription')

            setMessage({ type: 'success', text: 'Subscription cancelled successfully' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setCancelLoading(false)
        }
    }

    const isAdmin = user.role === 'ADMIN'

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-navy-900">Billing & Plan</h2>
                    <p className="text-slate-600 text-sm mt-1">Manage your subscription and payment methods.</p>
                </div>
                {(user.plan === 'premium' || isAdmin) && <PremiumBadge />}
            </div>

            {message && (
                <div className="mb-4">
                    <Alert type={message.type} message={message.text} />
                </div>
            )}

            <div className="bg-ivory-100 p-4 rounded-lg border border-ivory-300 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Current Plan</p>
                        <p className="text-2xl font-bold text-navy-900 capitalize">
                            {isAdmin ? 'Admin Plan (Free Premium)' : `${user.plan} Plan`}
                        </p>
                    </div>
                    <div>
                        {!isAdmin && user.plan === 'free' ? (
                            <ButtonPrimary onClick={() => window.location.href = '/#pricing'}>
                                Upgrade to Premium
                            </ButtonPrimary>
                        ) : !isAdmin && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelLoading}
                                className="text-red-600 hover:text-red-700 text-sm font-medium underline"
                            >
                                {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-3">Invoice History</h3>
                {invoices.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">No invoices found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="py-2 font-medium text-slate-600">Date</th>
                                    <th className="py-2 font-medium text-slate-600">Amount</th>
                                    <th className="py-2 font-medium text-slate-600">Status</th>
                                    <th className="py-2 font-medium text-slate-600"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="border-b border-slate-100">
                                        <td className="py-3 text-slate-800">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="py-3 text-slate-800">{inv.currency} {inv.amount.toFixed(2)}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <a href={inv.downloadUrl} className="text-gold-600 hover:text-gold-700 font-medium">
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    )
}
