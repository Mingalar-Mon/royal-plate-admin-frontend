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
        <div className="flex items-center justify-end gap-1.5">
            <Tooltip title="View Details">
                <div
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl text-primary hover:bg-primary-subtle hover:text-primary-deep"
                    onClick={onView}
                >
                    <TbEye />
                </div>
            </Tooltip>
            {onEdit && (
                <Tooltip title="Edit">
                    <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-xl text-gray-600 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-700" onClick={onEdit}>
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
