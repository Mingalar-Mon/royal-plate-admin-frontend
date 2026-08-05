import { TbEye, TbEdit, TbPrinter, TbTrash } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'
// import Button from '@/components/ui/Button'
// import { useNavigate } from 'react-router'
// import { Order } from '../types/order.type'

const ActionColumn = ({
    onView,
    onEdit,
    onDelete,
}: {
    onView: () => void
    onEdit?: () => void
    onDelete?: () => void
}) => {
    const position = `${onEdit && onDelete ? 'justify-between' : 'justify-start'}`
    return (
        <div className={`  flex items-center justify-start ${position} gap-2`}>
            <Tooltip title="View">
                <div className="text-xl cursor-pointer" onClick={onView}>
                    <TbEye />
                </div>
            </Tooltip>

            {onEdit && (
                <Tooltip title="Edit">
                    <div className="text-xl cursor-pointer" onClick={onEdit}>
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
