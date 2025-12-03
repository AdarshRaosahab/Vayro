import React from 'react'

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    className?: string
}

interface TableProps<T> {
    data: T[]
    columns: Column<T>[]
    onRowClick?: (item: T) => void
}

export default function Table<T extends { id: string | number }>({ data, columns, onRowClick }: TableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full bg-white">
                <thead className="bg-slate-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-6 py-3 text-left text-xs font-bold text-slateGray uppercase tracking-wider ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onRowClick && onRowClick(item)}
                            className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                            {columns.map((col, index) => (
                                <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-deepNavy">
                                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
