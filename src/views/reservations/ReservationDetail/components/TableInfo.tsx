import Card from '@/components/ui/Card'
import { TbTable, TbUsers, TbClock, TbCoin } from 'react-icons/tb'
import type { Table } from '../../types/reservation.type'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? Math.trunc(n).toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

const TableInfo = ({ table }: { table: Table }) => {
    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbTable className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Table Assignment
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                        <TbTable className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Table Type
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {table.type}
                    </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                        <TbUsers className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Capacity
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {table.capacity} persons
                    </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                        <TbClock className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Duration
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {table.durationMinutes} min
                    </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5 dark:bg-primary/10">
                    <div className="flex items-center gap-2">
                        <TbCoin className="text-primary" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Table Fee
                        </span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                        {formatCurrency(table.tableFee)}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default TableInfo
