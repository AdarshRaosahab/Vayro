import { GetServerSideProps } from 'next'
import { getLinkByCode } from '../lib/links'
import { recordEvent } from '../lib/analytics'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
    link?: {
        code: string
        target: string
        status: string
    }
    preview?: boolean
    showCaution?: boolean
}

export default function RedirectPage({ link, preview, showCaution }: Props) {
    const [redirecting, setRedirecting] = useState(false)

    const handleContinue = () => {
        setRedirecting(true)
        window.location.href = link!.target
    }

    const handleDontShowAgain = () => {
        setRedirecting(true)
        // Set cookie for 1 year
        document.cookie = "vayro_caution_accepted=true; path=/; max-age=31536000; SameSite=Lax"
        window.location.href = link!.target
    }

    if ((preview || showCaution) && link) {
        return (
            <Layout title={preview ? "Link Preview - VAYRO" : "Security Check - VAYRO"}>
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-heading font-bold text-deepNavy mb-2">
                                {preview ? "Link Safety Preview" : "Leaving VAYRO"}
                            </h1>
                            <p className="text-slate-500">
                                {preview ? "You are about to be redirected to:" : "This link is taking you to an external site:"}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 break-all font-mono text-sm text-slate-700 text-center">
                            {link.target}
                        </div>

                        <div className="flex flex-col gap-3">
                            {preview ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleContinue}
                                        disabled={redirecting}
                                        className="w-full py-3 bg-deepNavy text-white font-bold rounded-xl hover:bg-navy-800 transition-colors text-center"
                                    >
                                        {redirecting ? 'Redirecting...' : 'Continue'}
                                    </button>
                                    <button
                                        onClick={handleDontShowAgain}
                                        disabled={redirecting}
                                        className="w-full py-3 bg-white text-slate-600 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors text-center"
                                    >
                                        Don't show again
                                    </button>
                                </>
                            )}
                        </div>

                        <p className="text-xs text-center text-slate-400 mt-6">
                            Vayro checks links for safety, but always be cautious.
                        </p>
                    </div>
                </div>
            </Layout>
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

    // Record analytics
    await recordEvent(link.id, req)

    // Check for caution cookie
    const cookies = req.headers.cookie || ''
    // TEMPORARY: Disabled "Leaving Vayro" warning as requested locally.
    const cautionAccepted = true; // cookies.includes('vayro_caution_accepted=true')

    if (!cautionAccepted) {
        return {
            props: {
                link: {
                    code: link.code,
                    target: link.target,
                    status: link.status
                },
                showCaution: true
            }
        }
    }

    return {
        redirect: {
            destination: link.target,
            permanent: false, // 302
        },
    }
}
