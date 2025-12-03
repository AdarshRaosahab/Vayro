import { useState } from 'react'
import { Card } from './Card'
import { ButtonPrimary } from './ButtonPrimary'
import { ButtonGhost } from './ButtonGhost'

interface ConfirmDeleteModalProps {
    linkId: string
    onDelete: (id: string) => Promise<void>
    onClose: () => void
}

export default function ConfirmDeleteModal({ linkId, onDelete, onClose }: ConfirmDeleteModalProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await onDelete(linkId)
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h2 className="text-xl font-heading font-bold text-deepNavy mb-2">Delete Link?</h2>
                <p className="text-slateGray mb-6">
                    This action cannot be undone. All analytics data for this link will be lost.
                </p>
                <div className="flex justify-center space-x-3">
                    <ButtonGhost onClick={onClose}>Cancel</ButtonGhost>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Delete Forever'}
                    </button>
                </div>
            </Card>
        </div>
    )
}
