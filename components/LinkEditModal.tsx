import { useState } from 'react'
import { Card } from './Card'
import { Input } from './Input'
import { ButtonPrimary } from './ButtonPrimary'
import { ButtonGhost } from './ButtonGhost'

interface LinkEditModalProps {
    link: any
    isPremium: boolean
    onSave: (id: string, updates: any) => Promise<void>
    onClose: () => void
}

export default function LinkEditModal({ link, isPremium, onSave, onClose }: LinkEditModalProps) {
    const [target, setTarget] = useState(link.target)
    const [code, setCode] = useState(link.code)
    const [note, setNote] = useState(link.note || '')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await onSave(link.id, { target, code, note })
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-heading font-bold text-deepNavy mb-4">Edit Link</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Destination URL"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <Input
                            label="Short Alias"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            disabled={!isPremium}
                            className={!isPremium ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
                        />
                        {!isPremium && (
                            <div className="absolute right-3 top-[34px] text-xs text-gold font-bold bg-white px-2 py-0.5 rounded border border-gold/20">
                                Premium
                            </div>
                        )}
                    </div>

                    {isPremium && (
                        <Input
                            label="Private Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Optional note for yourself"
                        />
                    )}
                    {!isPremium && (
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-500 text-center">
                            Upgrade to customize alias and add private notes.
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 mt-6">
                        <ButtonGhost type="button" onClick={onClose}>Cancel</ButtonGhost>
                        <ButtonPrimary type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </ButtonPrimary>
                    </div>
                </form>
            </Card>
        </div>
    )
}
