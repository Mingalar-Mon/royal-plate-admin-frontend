import ReservationStatusBadge from '../../components/ReservationStatusBadge'
import { Reservation } from '@/services/ReservationService'
import type { ReservationStatus as ReservationStatusValue } from '../../types/reservation.type'

interface ReservationInfoProps {
    reservation: Reservation
    onStatusChange?: (status: ReservationStatusValue) => void
    isStatusUpdating?: boolean
}

const ReservationInfo = ({
    reservation,
    onStatusChange,
    isStatusUpdating = false,
}: ReservationInfoProps) => {
    return (
        <div className="shrink-0">
            <ReservationStatusBadge
                status={reservation.status}
                onChange={onStatusChange}
                isLoading={isStatusUpdating}
            />
        </div>
    )
}

export default ReservationInfo
