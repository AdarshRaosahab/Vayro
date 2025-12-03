import React from 'react'
import { Card } from './Card'

interface AnalyticsCardProps {
    title: string
    value: string | number
    trend?: string
    trendUp?: boolean
    data?: number[] // Simple array for sparkline
}

export default function AnalyticsCard({ title, value, trend, trendUp, data }: AnalyticsCardProps) {
    return (
        <Card className="flex flex-col justify-between h-full">
            <div>
                <p className="text-sm font-medium text-slateGray">{title}</p>
                <h4 className="text-3xl font-bold text-deepNavy mt-2">{value}</h4>
                {trend && (
                    <p className={`text-sm mt-2 flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-1">{trendUp ? '↑' : '↓'}</span>
                        {trend}
                    </p>
                )}
            </div>
            {data && (
                <div className="mt-4 h-16 flex items-end space-x-1">
                    {data.map((d, i) => (
                        <div
                            key={i}
                            className="bg-gold opacity-50 rounded-t-sm flex-1 hover:opacity-100 transition-opacity"
                            style={{ height: `${d}%` }}
                        />
                    ))}
                </div>
            )}
        </Card>
    )
}
