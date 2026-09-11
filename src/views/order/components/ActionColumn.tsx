import { TbEye, TbEdit, TbPrinter, TbTrash } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'
// import Button from '@/components/ui/Button'
// import { useNavigate } from 'react-router'
// import { Order } from '../types/order.type'

const ActionColumn = ({
    onView,
    onEdit,
    onDelete,
    viewClassName = 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
    editClassName = 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
}: {
    onView: () => void
    onEdit?: () => void
    onDelete?: () => void
    viewClassName?: string
    editClassName?: string
}) => {
    const position = `${onEdit && onDelete ? 'justify-between' : 'justify-start'}`
    return (
        <div className={`  flex items-center justify-start ${position} gap-2`}>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer ${viewClassName}`}
                    onClick={onView}
                >
                    <TbEye />
                </div>
            </Tooltip>

            {onEdit && (
                <Tooltip title="Edit">
                    <div
                        className={`text-xl cursor-pointer ${editClassName}`}
                        onClick={onEdit}
                    >
                        <TbEdit />
                    </div>
                </Tooltip>
            )}
            {onDelete && (
                <Tooltip title="Delete">
                    <div
                        className="text-xl cursor-pointer text-red-500"
                        onClick={onDelete}
                    >
                        <TbTrash />
                    </div>
                </Tooltip>
            )}
        </div>
    )
}

// const ActionColumn = ({ row }: { row: Order }) => {
//     const navigate = useNavigate()

//     return (
//         <div className="flex gap-2">
//             <Button
//                 size="xs"
//                 icon={<TbEye />}
//                 onClick={() => navigate(`/orders/${row.id}`)}
//             />
//             <Button
//                 size="xs"
//                 icon={<TbEdit />}
//                 onClick={() => navigate(`/orders/edit/${row.id}`)}
//             />
//             <Button size="xs" icon={<TbPrinter />} />
//         </div>
//     )
// }

export default ActionColumn
