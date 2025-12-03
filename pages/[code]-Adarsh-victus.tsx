import { GetServerSideProps } from 'next'
import { getLinkByCode } from '../lib/links'
import { recordEvent } from '../lib/analytics'
import { db } from '../lib/db'
import Layout from '../components/Layout'
import Link from 'next/link'
import Head from 'next/head'
import { useState, useEffect } from 'react'

interface Props {
    link?: {
        code: string
        target: string
        status: string
    }
    preview?: boolean
}

export default function RedirectPage({ link, preview, shouldRedirect }: Props & { shouldRedirect?: boolean }) {
    const [showWarning, setShowWarning] = useState(true)

    useEffect(() => {
        if (shouldRedirect && !showWarning && link) {
            window.location.href = link.target
        }
    }, [shouldRedirect, showWarning, link])

    if (preview && link) {
        return (
            <Layout title="Link Preview - VAYRO">
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-heading font-bold text-deepNavy mb-2">Link Safety Preview</h1>
                            <p className="text-slate-500">You are about to be redirected to:</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 break-all font-mono text-sm text-slate-700">
                            {link.target}
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={link.target}
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-deepNavy text-white font-bold rounded-xl hover:bg-navy-800 transition-colors text-center"
                            >
                                Continue to Site
                            </a>
                            <Link
                                href="/report"
                                className="w-full py-3 bg-white text-red-500 border border-red-100 font-bold rounded-xl hover:bg-red-50 transition-colors text-center"
                            >
                                Report Abuse
                            </Link>
                        </div>

                        <p className="text-xs text-center text-slate-400 mt-6">
                            Vayro checks links for safety, but always be cautious.
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (shouldRedirect && link) {
        return (
            <>
                <Head>
                    <title>Redirecting... | VAYRO</title>
                    <meta name="robots" content="noindex" />
                </Head>
                {showWarning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 to-gold-600" />

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-heading font-bold text-deepNavy mb-2">
                                    Safety Caution
                                </h3>

                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                    Do not open this link if you received it from an unknown source. Vayro is a public tool, and we want to ensure you stay safe from potential fraud.
                                </p>

                                <button
                                    onClick={() => setShowWarning(false)}
                                    className="w-full py-3 bg-deepNavy text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                                >
                                    I Understand, Continue
                                </button>

                                <p className="text-xs text-slate-400 mt-4">
                                    This is a safety message from Vayro.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">Redirecting to {link.target}...</p>
                    </div>
                </div>
            </>
        )
    }

    return null
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
    let code = params?.code as string

    if (!code) {
        return { notFound: true }
    }

    // Check for preview mode (trailing +)
    const isPreview = code.endsWith('+')
    if (isPreview) {
        code = code.slice(0, -1)
    }

    const link = await getLinkByCode(code)

    if (!link) {
        return { notFound: true }
    }

    // Safety Check: If link is banned, redirect to warning page
    if (link.status === 'BANNED') {
        return {
            redirect: {
                destination: '/banned',
                permanent: false,
            },
        }
    }

    // FREE PLAN LIMIT: Max 1000 Clicks/Month
    // If the link belongs to a free user, check their usage
    if (link.user?.plan === 'free') {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const clickCount = await db.clickEvent.count({
            where: {
                linkId: link.id,
                createdAt: {
                    gte: startOfMonth
                }
            }
        })

        if (clickCount >= 1000) {
            return {
                redirect: {
                    destination: '/pricing?limit=clicks', // Redirect to upgrade page
                    permanent: false,
                },
            }
        }
    }

    // If preview mode, return props to render the preview page
    if (isPreview) {
        return {
            props: {
                link: {
                    code: link.code,
                    target: link.target,
                    status: link.status
                },
                preview: true
            }
        }
    }

    // Record analytics (fire and forget-ish, but we await to ensure it starts)
    await recordEvent(link.id, req)

    return {
        props: {
            link: {
                code: link.code,
                target: link.target,
                status: link.status
            },
            shouldRedirect: true
        }
    }
}
