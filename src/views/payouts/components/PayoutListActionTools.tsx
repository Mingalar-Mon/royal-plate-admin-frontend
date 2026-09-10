import Button from '@/components/ui/Button'
import { TbRefresh } from 'react-icons/tb'

const PayoutListActionTools = ({
    onRefresh,
}: {
    onRefresh: () => void
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
    </div>
)

export default PayoutListActionTools