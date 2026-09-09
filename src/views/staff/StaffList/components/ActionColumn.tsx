import { TbEye, TbEdit, TbTrash } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'
import Spinner from '@/components/ui/Spinner'

interface ActionColumnProps {
    onView: () => void
    onEdit?: () => void
    onDelete?: () => void
    isDeleting?: boolean
}

const ActionColumn = ({
    onView,
    onEdit,
    onDelete,
    isDeleting = false,
}: ActionColumnProps) => {
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
                    <div
                        className="text-xl cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={onEdit}
                    >
                        <TbEdit />
                    </div>
                </Tooltip>
            )}
            {onDelete && (
                <Tooltip title={isDeleting ? 'Deleting...' : 'Delete'}>
                    <div
                        className={`text-xl ${
                            isDeleting
                                ? 'text-gray-400'
                                : 'cursor-pointer text-red-500 hover:text-red-700'
                        }`}
                        onClick={isDeleting ? undefined : onDelete}
                    >
                        {isDeleting ? <Spinner size={20} /> : <TbTrash />}
                    </div>
                </Tooltip>
            )}
        </div>
    )
}

export default ActionColumn
