import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { TbArrowNarrowLeft, TbCalendarEvent, TbClock, TbHash } from 'react-icons/tb'
import {
    useReservation,
    useUpdateReservationStatus,
} from '@/utils/custom-hooks/useReservation'
import ReservationInfo from './components/ReservationInfo'
import UserInfo from './components/UserInfo'
import TableInfo from './components/TableInfo'
import DishesList from './components/DishList'
import ActivityTimeline from './components/ActivityTimeline'
import PaymentSummary from './components/PaymentSummary'
import type { ReservationStatus } from '../types/reservation.type'
import dayjs from 'dayjs'

const ReservationDetail = () => {
    const { reservationId, restaurantId } = useParams()
    const navigate = useNavigate()

    const {
        data: reservationResponse,
        isLoading,
        refetch,
    } = useReservation(reservationId!)

    const { mutate: updateStatus, isPending: isStatusUpdating } =
        useUpdateReservationStatus()

    const reservation = reservationResponse?.data

    const handleStatusChange = (status: ReservationStatus) => {
        updateStatus(
            { reservationId: reservation!.id, status },
            { onSuccess: () => refetch() },
        )
    }

    if (isLoading) {
        return (
            <Container>
                <div className="py-6 space-y-6">
                    <Skeleton width={180} height={36} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton width="100%" height={200} />
                            <Skeleton width="100%" height={300} />
                        </div>
                        <div className="space-y-6">
                            <Skeleton width="100%" height={150} />
                            <Skeleton width="100%" height={150} />
                            <Skeleton width="100%" height={200} />
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    if (!reservation) {
        return (
            <Container>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Card bodyClass="p-8">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Reservation not found
                            </p>
                            <Button
                                className="mt-4"
                                variant="plain"
                                icon={<TbArrowNarrowLeft />}
                                onClick={() =>
                                    navigate(
                                        `/restaurants/${restaurantId}/reservations`,
                                    )
                                }
                            >
                                Back to Reservations
                            </Button>
                        </div>
                    </Card>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center">
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/reservations`)
                        }
                    >
                        Back to Reservations
                    </Button>
                </div>

                {/* Title Card */}
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
                                {reservation.reservationNumber}
                            </h2>
                            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <TbClock className="text-sm sm:text-base" />
                                    {dayjs(reservation.startingTime).format('HH:mm')} - {dayjs(reservation.endingTime).format('HH:mm')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <TbHash className="text-sm sm:text-base" />
                                    {dayjs(reservation.reservationDate).format('DD/MM/YYYY')}
                                </span>
                            </div>
                        </div>
                        <ReservationInfo
                            reservation={reservation}
                            onStatusChange={handleStatusChange}
                            isStatusUpdating={isStatusUpdating}
                        />
                    </div>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <DishesList
                            reservationItems={reservation.reservationItems || []}
                        />
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

                    {/* Right Column */}
                    <div className="space-y-6">
                        <UserInfo user={reservation.user} />
                        <TableInfo table={reservation.table} />
                        <PaymentSummary reservation={reservation} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ReservationDetail
