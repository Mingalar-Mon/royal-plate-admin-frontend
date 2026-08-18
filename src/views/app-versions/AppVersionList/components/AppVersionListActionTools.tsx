import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const AppVersionListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex gap-3">
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() => navigate('/app-versions/create')}
            >
                Add App Version
            </Button>
        </div>
    )
}

export default AppVersionListActionTools
