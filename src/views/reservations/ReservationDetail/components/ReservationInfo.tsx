import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import ReservationStatusBadge from '../../components/ReservationStatusBadge'
import { Reservation } from '@/services/ReservationService'
// import type { Reservation } from '../../types/reservation.type'

const ReservationInfo = ({ reservation }: { reservation: Reservation }) => {
    return (
        <Card>
            <div className="flex justify-between items-start mb-4">
                <h4>Reservation Details</h4>
                <ReservationStatusBadge
                    readOnly
                    status={reservation.status}
                    onChange={() => {}}
                />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Reservation ID</span>
                    <span>{reservation.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Date</span>
                    <span>
                        {dayjs(reservation.reservationDate).format(
                            'DD/MM/YYYY',
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Time</span>
                    <span>
                        {dayjs(reservation.startingTime).format('HH:mm')} -{' '}
                        {dayjs(reservation.endingTime).format('HH:mm')}
                    </span>
                </div>
                {reservation.remark && (
                    <div className="mt-2 pt-2 border-t">
                        <span className="font-medium">Remark</span>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {reservation.remark}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default ReservationInfo
