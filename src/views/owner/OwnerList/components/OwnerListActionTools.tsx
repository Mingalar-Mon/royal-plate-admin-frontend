import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const OwnerListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex gap-3">
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() => navigate('/owners/create')}
            >
                Create Owner
            </Button>
        </div>
    )
}

export default OwnerListActionTools
