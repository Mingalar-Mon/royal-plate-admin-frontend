import Card from '@/components/ui/Card'
import { TbTable, TbUsers } from 'react-icons/tb'
import type { Table } from '../../types/reservation.type'

const TableInfo = ({ table }: { table: Table }) => {
    return (
        <Card>
            <h4 className="mb-4">Table Assignment</h4>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <TbTable className="text-gray-500" />
                    <span>Type: {table.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TbUsers className="text-gray-500" />
                    <span>Capacity: {table.capacity} persons</span>
                </div>
            </div>
        </Card>
    )
}

export default TableInfo
