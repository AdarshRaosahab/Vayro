import Head from 'next/head'
import Link from 'next/link'
import AnalyticsTable from '../components/AnalyticsTable'

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Head>
                <title>Dashboard | Vayro</title>
            </Head>

            {/* Sidebar */}
            <aside className="w-64 bg-navy-900 text-white fixed h-full hidden md:flex flex-col border-r border-navy-800">
                <div className="p-6">
                    <div className="text-2xl font-heading font-black tracking-tight text-white">
                        VAYRO<span className="text-gold-500">.</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-navy-800 text-gold-400 rounded-lg font-bold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Dashboard
                    </Link>
                    <Link href="/links" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-colors font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        My Links
                    </Link>
                    <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-colors font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Analytics
                    </Link>
                </nav>
                <div className="p-4 border-t border-navy-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-navy-900">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Adarsh Y</p>
                            <p className="text-xs text-slate-400">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-navy-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
                    </div>
                    <button className="px-6 py-3 bg-navy-900 text-gold-500 font-bold rounded-lg shadow-lg hover:bg-navy-800 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Create New Link
                    </button>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Clicks</p>
                        <p className="text-4xl font-heading font-black text-navy-900">24,592</p>
                        <p className="text-green-500 text-sm font-bold mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            +12% this week
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Active Links</p>
                        <p className="text-4xl font-heading font-black text-navy-900">142</p>
                        <p className="text-slate-400 text-sm font-bold mt-2">
                            Across 5 campaigns
                        </p>
                    </div>
                    <div className="p-6 bg-navy-900 rounded-xl shadow-lg border border-navy-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <p className="text-sm font-bold text-gold-500 uppercase tracking-wider mb-2">Current Plan</p>
                        <p className="text-4xl font-heading font-black text-white">PRO</p>
                        <button className="text-white text-sm font-bold mt-2 underline decoration-gold-500 decoration-2 underline-offset-2 hover:text-gold-400 transition-colors">
                            Manage Billing
                        </button>
                    </div>
                </div>

                {/* Recent Links Table */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-navy-900">Recent Links</h2>
                        <a href="#" className="text-sm font-bold text-navy-600 hover:text-navy-900">View All</a>
                    </div>
                    <AnalyticsTable />
                </section>

            </main>
        </div>
    )
}
