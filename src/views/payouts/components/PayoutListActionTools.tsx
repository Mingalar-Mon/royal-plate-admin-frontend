import Button from '@/components/ui/Button'
import PayoutListExportTools from './PayoutListExportTools'
import { TbRefresh } from 'react-icons/tb'

const PayoutListActionTools = ({
    onRefresh,
    requireRestaurant,
}: {
    onRefresh: () => void
    requireRestaurant?: boolean
}) => (
    <div className="flex items-center gap-2">
        <Button
            size="sm"
            variant="default"
            icon={<TbRefresh />}
            onClick={onRefresh}
        >
            Refresh
        </Button>
        <PayoutListExportTools requireRestaurant={requireRestaurant} />
    </div>
)

export default PayoutListActionTools