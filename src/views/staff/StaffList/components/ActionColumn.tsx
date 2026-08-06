import { TbEye, TbEdit, TbTrash } from 'react-icons/tb'
import Tooltip from '@/components/ui/Tooltip'

interface ActionColumnProps {
    onView: () => void
    onEdit?: () => void
    onDelete?: () => void
}

const ActionColumn = ({ onView, onEdit, onDelete }: ActionColumnProps) => {
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
                <Tooltip title="Delete">
                    <div
                        className="text-xl cursor-pointer text-red-500 hover:text-red-700"
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
