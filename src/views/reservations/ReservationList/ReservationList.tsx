import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ReservationListActionTools from '../components/ReservationListActionTools'
import ReservationListTableTools from '../components/ReservationListTableTools'
import ReservationListCards from '../components/ReservationListCards'
import { useParams } from 'react-router'
import { useReservations } from '@/utils/custom-hooks/useReservation'
import { useReservationStore } from '@/store/reservationStore'

const ReservationList = () => {
    const { restaurantId } = useParams()
    const tableData = useReservationStore((state) => state.tableData)

    // Lift the hook execution to the parent boundary as a single source of truth
    const {
        reservations,
        total,
        // tableData,
        // setTableData,
        isLoading,
        // updateStatus,
        refetch,
    } = useReservations({ restaurantId: restaurantId!, params: tableData })

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base sm:text-lg text-primary">Reservations</h3>
                        <ReservationListActionTools onRefresh={refetch} />
                    </div>
                    <ReservationListTableTools />
                    <ReservationListCards
                        restaurantId={restaurantId!}
                        reservations={reservations}
                        total={total}
                        isLoading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default ReservationList
