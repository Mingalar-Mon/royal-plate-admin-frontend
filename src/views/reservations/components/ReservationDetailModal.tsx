import Dialog from '@/components/ui/Dialog'
import type { Reservation } from '@/services/ReservationService'
import ReservationInfo from '@/views/reservations/ReservationDetail/components/ReservationInfo'
import DishesList from '@/views/reservations/ReservationDetail/components/DishList'
import PaymentSummary from '@/views/reservations/ReservationDetail/components/PaymentSummary'
import ActivityTimeline from '@/views/reservations/ReservationDetail/components/ActivityTimeline'
import UserInfo from '@/views/reservations/ReservationDetail/components/UserInfo'
import TableInfo from '@/views/reservations/ReservationDetail/components/TableInfo'

interface ReservationDetailModalProps {
    reservation: Reservation | null
    onClose: () => void
}

const ReservationDetailModal = ({
    reservation,
    onClose,
}: ReservationDetailModalProps) => {
    if (!reservation) return null

    return (
        <Dialog
            isOpen={Boolean(reservation)}
            width={900}
            contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <ReservationInfo reservation={reservation} />
                        <DishesList
                            reservationItems={
                                reservation.reservationItems || []
                            }
                        />
                        <PaymentSummary
                            subTotal={reservation.subTotal}
                            tax={reservation.tax}
                            total={reservation.totalPrice}
                        />
                        <ActivityTimeline
                            createdAt={reservation.created_at}
                            updatedAt={reservation.updated_at}
                            status={reservation.status}
                        />
                    </div>
                    <div className="lg:w-90 space-y-6">
                        <UserInfo user={reservation.user} />
                        <TableInfo table={reservation.table} />
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ReservationDetailModal
