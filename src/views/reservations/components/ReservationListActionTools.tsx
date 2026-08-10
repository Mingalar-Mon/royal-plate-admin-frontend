import Button from '@/components/ui/Button'
import { TbRefresh } from 'react-icons/tb'

const ReservationListActionTools = ({
    onRefresh,
}: {
    onRefresh: () => void
}) => {
    return (
        <div className="flex flex-col gap-3 md:flex-row">
            <Button icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default ReservationListActionTools
