import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Card } from '../../components/Card'
import Table from '../../components/Table'
import Badge from '../../components/Badge'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        try {
            const res = await fetch('/api/admin/stats')
            if (res.status === 401) {
                window.location.href = '/login'
                return
            }
            if (res.status === 403) {
                setError('Access Denied. You are not an admin.')
                setLoading(false)
                return
            }

            const data = await res.json()
            if (res.ok) {
                setStats(data)
            } else {
                setError(data.message || 'Failed to fetch stats')
            }
        } catch (err) {
            setError('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Layout title="Admin Dashboard">Loading...</Layout>
    if (error) return (
        <Layout title="Admin Dashboard">
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-slateGray">{error}</p>
            </div>
        </Layout>
    )

    return (
        <Layout title="Admin Dashboard" hideFooter={true}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-heading font-bold text-deepNavy mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <h3 className="text-slateGray text-sm font-semibold uppercase tracking-wider">Total Users</h3>
                        <p className="text-4xl font-bold text-deepNavy mt-2">{stats?.stats?.totalUsers}</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-slateGray text-sm font-semibold uppercase tracking-wider">Total Links</h3>
                        <p className="text-4xl font-bold text-deepNavy mt-2">{stats?.stats?.totalLinks}</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-slateGray text-sm font-semibold uppercase tracking-wider">Total Clicks</h3>
                        <p className="text-4xl font-bold text-deepNavy mt-2">{stats?.stats?.totalClicks}</p>
                    </Card>
                </div>

                {/* Recent Users Table */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-heading font-bold text-deepNavy">Recent Signups</h2>
                    </div>
                    <Table
                        data={stats?.recentUsers || []}
                        columns={[
                            {
                                header: 'User',
                                accessor: (user: any) => (
                                    <div>
                                        <div className="font-semibold text-deepNavy">{user.displayName || 'No Name'}</div>
                                        <div className="text-sm text-slateGray">{user.email}</div>
                                    </div>
                                )
                            },
                            {
                                header: 'Plan',
                                accessor: (user: any) => (
                                    <Badge variant={user.plan === 'premium' ? 'success' : 'neutral'}>
                                        {user.plan.toUpperCase()}
                                    </Badge>
                                )
                            },
                            {
                                header: 'Joined',
                                accessor: (user: any) => new Date(user.createdAt).toLocaleDateString()
                            }
                        ]}
                    />
                </Card>

                {/* User Management Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-heading font-bold text-deepNavy mb-4">User Management</h2>
                    <Card className="p-6">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search user by email..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                    onChange={(e) => {
                                        if (e.target.value.length > 2) {
                                            fetch(`/api/admin/users?q=${e.target.value}`)
                                                .then(res => res.json())
                                                .then(data => setStats((prev: any) => ({ ...prev, searchResults: data.users })))
                                        } else {
                                            setStats((prev: any) => ({ ...prev, searchResults: null }))
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {stats?.searchResults && (
                            <Table
                                data={stats.searchResults}
                                columns={[
                                    {
                                        header: 'User',
                                        accessor: (user: any) => (
                                            <div>
                                                <div className="font-semibold text-deepNavy">{user.displayName || 'No Name'}</div>
                                                <div className="text-sm text-slateGray">{user.email}</div>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Status',
                                        accessor: (user: any) => (
                                            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>
                                                {user.status}
                                            </Badge>
                                        )
                                    },
                                    {
                                        header: 'Plan',
                                        accessor: (user: any) => user.plan.toUpperCase()
                                    },
                                    {
                                        header: 'Actions',
                                        accessor: (user: any) => (
                                            <div className="flex gap-2">
                                                {user.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm('Are you sure you want to suspend this user?')) return
                                                            await fetch('/api/admin/user-action', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ userId: user.id, action: 'suspend' })
                                                            })
                                                            // Refresh search
                                                            const res = await fetch(`/api/admin/users?q=${user.email}`)
                                                            const data = await res.json()
                                                            setStats((prev: any) => ({ ...prev, searchResults: data.users }))
                                                        }}
                                                        className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 font-medium"
                                                    >
                                                        Suspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={async () => {
                                                            await fetch('/api/admin/user-action', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ userId: user.id, action: 'unsuspend' })
                                                            })
                                                            // Refresh search
                                                            const res = await fetch(`/api/admin/users?q=${user.email}`)
                                                            const data = await res.json()
                                                            setStats((prev: any) => ({ ...prev, searchResults: data.users }))
                                                        }}
                                                        className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full hover:bg-green-200 font-medium"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        )}
                        {stats?.searchResults && stats.searchResults.length === 0 && (
                            <p className="text-center text-slate-400 py-4">No users found.</p>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
