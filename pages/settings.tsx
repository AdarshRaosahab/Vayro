import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { AccountSettings } from '../components/AccountSettings'
import { PasswordChangeForm } from '../components/PasswordChangeForm'
import { BillingStatus } from '../components/BillingStatus'
import { Preferences } from '../components/Preferences'

export default function Settings() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'preferences'>('account')

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.status === 401) {
                    router.push('/login')
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data && data.user) {
                    setUser(data.user)
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [router])

    if (loading) {
        return (
            <Layout title="Settings | VAYRO">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                </div>
            </Layout>
        )
    }

    if (!user) return null

    return (
        <Layout title="Settings | VAYRO">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-navy-900 mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'account'
                                        ? 'bg-navy-50 text-navy-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                Account & Security
                            </button>
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'billing'
                                        ? 'bg-navy-50 text-navy-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                Billing & Plan
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'preferences'
                                        ? 'bg-navy-50 text-navy-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                Preferences
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {activeTab === 'account' && (
                            <>
                                <AccountSettings user={user} />
                                <PasswordChangeForm />
                            </>
                        )}

                        {activeTab === 'billing' && (
                            <BillingStatus user={user} />
                        )}

                        {activeTab === 'preferences' && (
                            <Preferences user={user} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
