import { useNavigate } from 'react-router'
import { useCreateAppSettingMutation } from '@/utils/custom-hooks/useAppSetting'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import AppSettingForm from '../components/AppSettingForm'
import type { AppSettingFormData } from '@/@types/appSetting'

const AppSettingCreate = () => {
    const navigate = useNavigate()
    const { mutate: createAppSetting, isPending } =
        useCreateAppSettingMutation()

    const handleSubmit = (formData: AppSettingFormData) => {
        createAppSetting(formData, {
            onSuccess: () => navigate('/settings'),
        })
    }

    return (
        <AdaptiveCard>
            <AppSettingForm isNew={true} onFormSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/settings')}
                    >
                        Back
                    </Button>
                    <Button type="submit" variant="solid" loading={isPending}>
                        Create Setting
                    </Button>
                </div>
            </AppSettingForm>
        </AdaptiveCard>
    )
}

export default AppSettingCreate
