import React from 'react'

export default function SpacingDemo() {
    const spaces = [8, 16, 24, 40, 72]

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Spacing System (8pt Grid)</h3>
            {spaces.map((space) => (
                <div key={space} className="flex items-center">
                    <div className="w-16 text-sm text-slateGray">{space}px</div>
                    <div className="bg-gold h-8 rounded" style={{ width: space }} />
                </div>
            ))}
        </div>
    )
}
