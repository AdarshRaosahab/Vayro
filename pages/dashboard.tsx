import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Card } from '../components/Card'
import Table from '../components/Table'
import { ButtonPrimary } from '../components/ButtonPrimary'
import { ButtonGhost } from '../components/ButtonGhost'
import Badge from '../components/Badge'
import AnalyticsPanel from '../components/AnalyticsPanel'
import LinkEditModal from '../components/LinkEditModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import PremiumBadge from '../components/PremiumBadge'
import UpsellCard from '../components/UpsellCard'

export default function Dashboard() {
    const [links, setLinks] = useState<any[]>([])
    const [selectedLink, setSelectedLink] = useState<any>(null)
    const [editingLink, setEditingLink] = useState<any>(null)
    const [deletingLink, setDeletingLink] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const authRes = await fetch('/api/auth/me')
            if (authRes.ok) {
                const authData = await authRes.json()
                setUser(authData.user)
            } else {
                window.location.href = '/login'
                return
            }

            const linksRes = await fetch('/api/links/list')
            const linksData = await linksRes.json()
            if (linksData.ok) {
                setLinks(linksData.links)
            }
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate(id: string, updates: any) {
        try {
            const res = await fetch('/api/links/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            })
            if (res.ok) {
                setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l))
            }
        } catch (error) {
            console.error('Failed to update link', error)
        }
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch('/api/links/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                setLinks(links.filter((l) => l.id !== id))
                if (selectedLink?.id === id) setSelectedLink(null)
            }
        } catch (error) {
            console.error('Failed to delete link', error)
        }
    }

    if (loading) return <Layout title="Dashboard">Loading...</Layout>

    return (
        <Layout title="Dashboard" hideFooter={true}>
            <div className="space-y-8 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-deepNavy flex items-center">
                            Overview
                            {user?.plan === 'premium' && <PremiumBadge />}
                        </h1>
                        <p className="text-slateGray mt-1">Welcome back, {user?.displayName || user?.email}</p>
                    </div>
                    <ButtonPrimary onClick={() => window.location.href = '/'}>Create New Link</ButtonPrimary>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Links List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-heading font-bold text-deepNavy">Your Links</h2>
                            </div>
                            <Table
                                data={links}
                                columns={[
                                    {
                                        header: 'Short Link',
                                        accessor: (link: any) => (
                                            <div className="font-semibold text-deepNavy cursor-pointer hover:text-gold transition-colors" onClick={() => setSelectedLink(link)}>
                                                /{link.code}
                                            </div>
                                        ),
                                    },
                                    {
                                        header: 'Target',
                                        accessor: (link: any) => (
                                            <div className="truncate max-w-[150px] text-slateGray" title={link.target}>
                                                {link.target}
                                            </div>
                                        ),
                                    },
                                    {
                                        header: 'Note',
                                        accessor: (link: any) => (
                                            <div>
                                                {link.note ? (
                                                    <Badge variant="neutral">{link.note}</Badge>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        header: 'Clicks',
                                        accessor: (link: any) => <Badge variant="neutral">{link.clicks_count || 0}</Badge>,
                                    },
                                    {
                                        header: 'Actions',
                                        accessor: (link: any) => (
                                            <div className="flex space-x-2 items-center">
                                                <ButtonGhost onClick={() => setSelectedLink(link)}>Stats</ButtonGhost>
                                                <button
                                                    className="text-slateGray hover:text-deepNavy"
                                                    onClick={() => setEditingLink(link)}
                                                    title="Edit Link"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button className="text-red-400 hover:text-red-600" onClick={() => setDeletingLink(link)}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                            {links.length === 0 && (
                                <div className="p-8 text-center text-slateGray">
                                    No links yet. Create one to get started!
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Analytics Panel (Side) */}
                    <div className="lg:col-span-1 space-y-6">
                        {user?.plan !== 'premium' && user?.role !== 'ADMIN' && <UpsellCard />}

                        {selectedLink ? (
                            <div className="sticky top-6">
                                <AnalyticsPanel
                                    linkId={selectedLink.id}
                                    onClose={() => setSelectedLink(null)}
                                    isPremium={user?.plan === 'premium' || user?.role === 'ADMIN'}
                                />
                            </div>
                        ) : (
                            <Card className="p-8 text-center text-slateGray h-full flex items-center justify-center border-dashed border-2 border-slate-200 bg-transparent shadow-none min-h-[200px]">
                                <div>
                                    <p>Select a link to view analytics</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Modals */}
                {editingLink && (
                    <LinkEditModal
                        link={editingLink}
                        isPremium={user?.plan === 'premium' || user?.role === 'ADMIN'}
                        onSave={handleUpdate}
                        onClose={() => setEditingLink(null)}
                    />
                )}
                {deletingLink && (
                    <ConfirmDeleteModal
                        linkId={deletingLink.id}
                        onDelete={handleDelete}
                        onClose={() => setDeletingLink(null)}
                    />
                )}
            </div>
        </Layout>
    )
}
