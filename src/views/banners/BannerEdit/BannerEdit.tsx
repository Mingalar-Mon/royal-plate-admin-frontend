import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    useBannerDetailQuery,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} from '@/utils/custom-hooks/useBanner'
import Button from '@/components/ui/Button'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import BannerForm from '../components/BannerForm'
import type { BannerFormData } from '@/@types/banner.type'

const BannerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    // 1. Fetch live details and bind production asynchronous mutation hooks
    const { data: bannerResponse, isLoading } = useBannerDetailQuery(id!)
    const { mutate: updateBanner, isPending: isUpdating } =
        useUpdateBannerMutation()
    const { mutate: deleteBanner } = useDeleteBannerMutation()

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    const banner = bannerResponse?.data // Unpack response envelope cleanly
    if (!banner) return <div className="p-8 text-center">Banner not found</div>

    // 2. Hydrate your form boundaries matching our updated validation models
    const defaultValues: BannerFormData = {
        image: banner.image.url, // Existing S3 string URL path maps directly here
        linkToRestaurant: banner.linkToRestaurant,
        type: banner.type,
    }

    const handleSubmit = (formData: BannerFormData) => {
        // 3. Prepare FormData since updating a banner handles a binary file stream upload
        const body = new FormData()
        body.append('linkToRestaurant', formData.linkToRestaurant)
        body.append('type', formData.type)

        // Only append raw binary file streams if a brand-new file was explicitly chosen
        if (formData.image instanceof File) {
            body.append('bannerImage', formData.image)
        }
        // else {
        // Otherwise preserve your existing database string reference path token
        // body.append('existingImageUrl', formData.image as string)
        // }

        updateBanner(
            { id: id!, data: body },
            {
                onSuccess: () => navigate('/banners'),
            },
        )
    }

    const handleDelete = () => {
        deleteBanner(id!, {
            onSuccess: () => navigate('/banners'),
        })
        setDeleteConfirmationOpen(false)
    }

    return (
        <AdaptiveCard>
            <BannerForm
                defaultValues={defaultValues}
                isNew={false}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/banners')}
                    >
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteConfirmationOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </BannerForm>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Banner"
                onClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to permanently remove this promotional
                    campaign banner? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </AdaptiveCard>
    )
}

export default BannerEdit
