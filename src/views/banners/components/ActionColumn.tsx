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
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer text-primary-600"
                    onClick={onView}
                >
                    <TbEye />
                </div>
            </Tooltip>
            {onEdit && (
                <Tooltip title="Edit">
                    <div
                        className="text-xl cursor-pointer text-blue-500"
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

export default ActionColumn
