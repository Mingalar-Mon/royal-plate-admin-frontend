import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import {
    useReservation,
    useUpdateReservationStatus,
} from '@/utils/custom-hooks/useReservation'
import ReservationInfo from './components/ReservationInfo'
import UserInfo from './components/UserInfo'
import TableInfo from './components/TableInfo'
import DishesList from './components/DishList'
import ActivityTimeline from './components/ActivityTimeline'
import type { ReservationStatus } from '../types/reservation.type'

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

    if (isLoading)
        return <div className="p-8 text-center">Loading reservation...</div>
    const reservation = reservationResponse?.data
    if (!reservation)
        return <div className="p-8 text-center">Reservation not found</div>

    const handleStatusChange = (status: ReservationStatus) => {
        updateStatus(
            { reservationId: reservation.id, status },
            { onSuccess: () => refetch() },
        )
    }

    return (
        <Container>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
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

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left column (2/3) */}
                    <div className="flex-1 space-y-6">
                        <ReservationInfo
                            reservation={reservation}
                            onStatusChange={handleStatusChange}
                            isStatusUpdating={isStatusUpdating}
                        />
                        <DishesList
                            reservationItems={
                                reservation.reservationItems || []
                            }
                        />
                        <ActivityTimeline
                            createdAt={reservation.created_at}
                            updatedAt={reservation.updated_at}
                            status={reservation.status}
                        />
                    </div>

                    {/* Right column (1/3) */}
                    <div className="lg:w-90 space-y-6">
                        <UserInfo user={reservation.user} />
                        <TableInfo table={reservation.table} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ReservationDetail
