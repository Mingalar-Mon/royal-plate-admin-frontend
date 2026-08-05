import { TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'

const ActionColumn = ({
    onView,
    onEdit,
    onDelete,
}: {
    onView: () => void
    onEdit: () => void
    onDelete?: () => void
}) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="View Details">
                <div
                    className="text-xl cursor-pointer text-primary-600 hover:text-primary-800"
                    onClick={onView}
                >
                    <TbEye />
                </div>
            </Tooltip>
            {onEdit && (
                <Tooltip title="Edit">
                    <div className="text-xl cursor-pointer" onClick={onEdit}>
                        <TbPencil />
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

export default ActionColumn
