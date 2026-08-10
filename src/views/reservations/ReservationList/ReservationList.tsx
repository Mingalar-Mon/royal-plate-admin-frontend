import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ReservationListActionTools from '../components/ReservationListActionTools'
import ReservationListTableTools from '../components/ReservationListTableTools'
import ReservationListTable from '../components/ReservationListTable'
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Reservations</h3>
                        <ReservationListActionTools onRefresh={refetch} />
                    </div>
                    <ReservationListTableTools />
                    <ReservationListTable
                        reservations={reservations}
                        total={total}
                        isLoading={isLoading}
                        // updateStatus={updateStatus}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default ReservationList
