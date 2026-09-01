import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'

interface CommissionListActionToolsProps {
    onAddCommission: () => void
}

const CommissionListActionTools = ({
    onAddCommission,
}: CommissionListActionToolsProps) => {
    return (
        <Button
            variant="solid"
            icon={<TbPlus />}
            onClick={onAddCommission}
        >
            Add Commission
        </Button>
    )
}

export default CommissionListActionTools