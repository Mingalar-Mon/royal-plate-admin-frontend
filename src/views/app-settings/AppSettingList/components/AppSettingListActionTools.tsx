import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const AppSettingListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex gap-3">
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() => navigate('/settings/create')}
            >
                Add Setting
            </Button>
        </div>
    )
}

export default AppSettingListActionTools
