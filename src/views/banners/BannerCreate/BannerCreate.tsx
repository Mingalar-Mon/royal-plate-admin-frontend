import { useNavigate } from 'react-router'
import { useCreateBannerMutation } from '@/utils/custom-hooks/useBanner'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import BannerForm from '../components/BannerForm' // Form path

const BannerCreate = () => {
    const navigate = useNavigate()
    const { mutate: createBanner, isPending } = useCreateBannerMutation()

    const handleSubmit = (formData: any) => {
        const body = new FormData()
        body.append('linkToRestaurant', formData.linkToRestaurant)
        body.append('type', formData.type)

        // Append the raw binary image stream selected in the form file input
        if (formData.image instanceof File) {
            body.append('bannerImage', formData.image)
        }

        createBanner(body, {
            onSuccess: () => navigate('/banners'),
        })
    }

    return (
        <AdaptiveCard>
            <BannerForm isNew={true} onFormSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/banners')}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isPending} // Plugs mutation state directly to the save button
                    >
                        Create Banner
                    </Button>
                </div>
            </BannerForm>
        </AdaptiveCard>
    )
}

export default BannerCreate
