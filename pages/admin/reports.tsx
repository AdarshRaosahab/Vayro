import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function AdminReports() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/admin/reports')
            if (res.status === 401) {
                router.push('/login')
                return
            }
            const data = await res.json()
            if (data.ok) {
                setReports(data.reports)
            }
        } catch (error) {
            console.error('Failed to fetch reports', error)
        } finally {
            setLoading(false)
        }
    }

    const banLink = async (linkId: string) => {
        if (!confirm('Are you sure you want to ban this link?')) return
        try {
            const res = await fetch('/api/admin/user-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'ban_link', targetId: linkId })
            })
            if (res.ok) {
                alert('Link banned')
                fetchReports()
            }
        } catch (error) {
            alert('Failed to ban link')
        }
    }

    const suspendUser = async (userId: string) => {
        if (!confirm('Are you sure you want to SUSPEND this user?')) return
        try {
            const res = await fetch('/api/admin/user-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'suspend_user', targetId: userId })
            })
            if (res.ok) {
                alert('User suspended')
                fetchReports()
            }
        } catch (error) {
            alert('Failed to suspend user')
        }
    }

    return (
        <Layout title="Abuse Reports - Admin">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-deepNavy mb-8">Abuse Reports</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Link</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {report.reason}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <div>Code: <span className="font-mono font-bold">{report.link.code}</span></div>
                                            <div className="text-xs truncate max-w-[200px]">{report.link.target}</div>
                                            {report.link.status === 'BANNED' && <span className="text-red-500 font-bold text-xs">BANNED</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {report.link.user ? (
                                                <>
                                                    <div>{report.link.user.email}</div>
                                                    {report.link.user.status === 'SUSPENDED' && <span className="text-red-500 font-bold text-xs">SUSPENDED</span>}
                                                </>
                                            ) : (
                                                <span className="italic">Anonymous</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => banLink(report.link.id)}
                                                className="text-red-600 hover:text-red-900"
                                                disabled={report.link.status === 'BANNED'}
                                            >
                                                Ban Link
                                            </button>
                                            {report.link.user && (
                                                <button
                                                    onClick={() => suspendUser(report.link.user.id)}
                                                    className="text-orange-600 hover:text-orange-900"
                                                    disabled={report.link.user.status === 'SUSPENDED'}
                                                >
                                                    Suspend User
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {reports.length === 0 && <p className="p-8 text-center text-slate-500">No reports found.</p>}
                    </div>
                )}
            </div>
        </Layout>
    )
}
