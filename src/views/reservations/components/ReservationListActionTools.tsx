import Button from '@/components/ui/Button'
import { TbRefresh } from 'react-icons/tb'

const ReservationListActionTools = ({
    // data,
    onRefresh,
}: {
    data: any[]
    onRefresh: () => void
}) => {
    // const { restaurantId } = useParams()

    // const { reservations } = useReservations(restaurantId)

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/* <CSVLink filename="reservations.csv" data={data}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default ReservationListActionTools
