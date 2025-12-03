import Layout from '@/components/Layout'
import { ButtonGold } from '@/components/ButtonGold'
import { ButtonGhost } from '@/components/ButtonGhost'
import Link from 'next/link'

export default function Pricing() {
    return (
        <Layout title="Pricing - VAYRO">
            <div className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deepNavy mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slateGray">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <PricingCard
                        title="Free"
                        price="₹0"
                        period="/month"
                        features={[
                            "Unlimited Short Links",
                            "Ad-supported"
                        ]}
                        button={<Link href="/register"><ButtonGhost className="w-full border-slate-300">Get Started</ButtonGhost></Link>}
                    />

                    {/* Premium Plan */}
                    <PricingCard
                        title="Premium"
                        price="₹299"
                        period="/month"
                        isPopular
                        features={[
                            "Everything in Free",
                            "Custom Domains",
                            "Advanced Analytics",
                            "Branded QR Codes",
                            "No Ads",
                            "Priority Support"
                        ]}
                        button={<Link href="/checkout"><ButtonGold className="w-full">Upgrade to Premium</ButtonGold></Link>}
                    />
                </div>
            </div>
        </Layout>
    )
}

function PricingCard({ title, price, period, features, button, isPopular }: any) {
    return (
        <div className={`p-8 rounded-2xl border ${isPopular ? 'border-gold-500 shadow-lg relative' : 'border-slate-200 bg-white'}`}>
            {isPopular && (
                <span className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    MOST POPULAR
                </span>
            )}
            <h3 className="text-2xl font-bold text-deepNavy mb-2">{title}</h3>
            <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-deepNavy">{price}</span>
                <span className="text-slateGray ml-1">{period}</span>
            </div>
            <ul className="space-y-4 mb-8">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center text-slateGray">
                        <svg className="w-5 h-5 text-gold-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>
            {button}
        </div>
    )
}
