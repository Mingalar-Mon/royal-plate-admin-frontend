import Button from '@/components/ui/Button'
import { TbRefresh } from 'react-icons/tb'

const ReservationListActionTools = ({
    onRefresh,
}: {
    onRefresh: () => void
}) => {
    return (
        <div className="flex items-center">
            <Button
                size="sm"
                icon={<TbRefresh className="text-lg" />}
                onClick={onRefresh}
            >
                <span className="hidden sm:inline">Refresh</span>
            </Button>
        </div>
    )
}

export default ReservationListActionTools
