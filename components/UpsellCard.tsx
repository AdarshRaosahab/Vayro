import { ButtonGold } from './ButtonGold'

export default function UpsellCard() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-deepNavy p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl"></div>

            <div className="relative z-10">
                <h3 className="text-lg font-heading font-bold text-gold mb-2">Upgrade to Premium</h3>
                <p className="text-slate-300 text-sm mb-6">
                    Unlock advanced analytics, bulk QR generation, and custom branding.
                </p>
                <ButtonGold
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full justify-center"
                >
                    Get Premium
                </ButtonGold>
            </div>
        </div>
    )
}
