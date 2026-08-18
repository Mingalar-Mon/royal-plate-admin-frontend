import { useNavigate } from 'react-router'
import { useCreateAppVersionMutation } from '@/utils/custom-hooks/useAppVersion'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import AppVersionForm from '../components/AppVersionForm'
import type { AppVersionFormData } from '@/@types/appVersion'

const AppVersionCreate = () => {
    const navigate = useNavigate()
    const { mutate: createAppVersion, isPending } =
        useCreateAppVersionMutation()

    const handleSubmit = (formData: AppVersionFormData) => {
        createAppVersion(formData, {
            onSuccess: () => navigate('/app-versions'),
        })
    }

    return (
        <AdaptiveCard>
            <AppVersionForm isNew={true} onFormSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/app-versions')}
                    >
                        Back
                    </Button>
                    <Button type="submit" variant="solid" loading={isPending}>
                        Create App Version
                    </Button>
                </div>
            </AppVersionForm>
        </AdaptiveCard>
    )
}

export default AppVersionCreate
