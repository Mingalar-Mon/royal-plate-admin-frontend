import Dialog from '@/components/ui/Dialog'
import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import { TbCalendarEvent, TbClock, TbHash } from 'react-icons/tb'
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
    return (
        <Dialog
            isOpen={Boolean(reservation)}
            width={900}
            contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
            onClose={onClose}
            onRequestClose={onClose}
        >
            {reservation && (
                <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                    {/* Header */}
                    <Card
                        className="border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                        bodyClass="p-4 sm:p-5"
                    >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                    <TbCalendarEvent className="text-sm" />
                                    Reservation Details
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {reservation.reservationNumber ||
                                        reservation.id}
                                </h2>
                                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <TbClock className="text-sm sm:text-base" />
                                        {dayjs(reservation.startingTime).format(
                                            'HH:mm',
                                        )}{' '}
                                        -{' '}
                                        {dayjs(reservation.endingTime).format(
                                            'HH:mm',
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <TbHash className="text-sm sm:text-base" />
                                        {dayjs(
                                            reservation.reservationDate,
                                        ).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                            </div>
                            <ReservationInfo reservation={reservation} />
                        </div>
                    </Card>

                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <div className="flex-1 space-y-4 sm:space-y-6">
                            <DishesList
                                reservationItems={
                                    reservation.reservationItems || []
                                }
                            />
                            <PaymentSummary reservation={reservation} />
                        </div>
                        <div className="lg:w-90 space-y-4 sm:space-y-6">
                            <UserInfo user={reservation.user} />
                            <TableInfo table={reservation.table} />
                        </div>
                    </div>
                    <ActivityTimeline
                        createdAt={reservation.created_at}
                        updatedAt={reservation.updated_at}
                        status={reservation.status}
                        confirmedAt={reservation.confirmed_at}
                        seatedAt={reservation.seated_at}
                        completedAt={reservation.complete_at}
                        terminatedAt={reservation.terminated_at}
                    />
                </div>
            )}
        </Dialog>
    )
}

export default ReservationDetailModal
