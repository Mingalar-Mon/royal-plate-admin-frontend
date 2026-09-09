import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { TbEdit, TbMail, TbCalendar, TbId } from 'react-icons/tb'
import dayjs from 'dayjs'
import StaffRoleBadge from './StaffRoleBadge'
import type { Staff } from '@/services/RestaurantStaffService'

interface StaffDetailModalProps {
    staff: Staff | null
    onClose: () => void
    onEdit: (staff: Staff) => void
}

const StaffDetailModal = ({ staff, onClose, onEdit }: StaffDetailModalProps) => {
    if (!staff) return null

    return (
        <Dialog
            isOpen={Boolean(staff)}
            width={560}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{staff.name}</h3>
                        <StaffRoleBadge role={staff.role} />
                    </div>
                    <Button
                        variant="solid"
                        icon={<TbEdit />}
                        onClick={() => onEdit(staff)}
                    >
                        Edit Staff
                    </Button>
                </div>
                <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <TbMail className="text-gray-500" />
                        <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TbId className="text-gray-500" />
                        <span>ID: {staff.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TbCalendar className="text-gray-500" />
                        <span>
                            Joined:{' '}
                            {dayjs(staff.created_at).format('DD/MM/YYYY')}
                        </span>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default StaffDetailModal