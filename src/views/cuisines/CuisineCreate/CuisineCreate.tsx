import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import CuisineForm from '../components/CuisineForm'
import type { CuisineFormData } from '../types/cuisine.type'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import { useCreateCuisineMutation } from '@/utils/custom-hooks/useCuisine'
import { AdaptiveCard } from '@/components/shared'

const CuisineCreate = () => {
    const navigate = useNavigate()

    // 1. Consume production mutations hooks natively
    const { mutate: createCuisine, isPending } = useCreateCuisineMutation()

    const handleSubmit = (formData: any) => {
        // 2. Prepare FormData because your backend relies on S3 file stream uploads
        const body = new FormData()
        body.append('name', formData.name)
        if (formData.description)
            body.append('description', formData.description)

        // Append your binary file asset from the form input
        if (formData.image instanceof File) {
            body.append('image', formData.image)
        }

        createCuisine(body, {
            onSuccess: () => navigate('/cuisines'),
        })
    }

    return (
        <AdaptiveCard>
            <CuisineForm onFormSubmit={handleSubmit} isNew={true}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/cuisines')}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isPending} // Direct usage of mutation pending loaders state
                    >
                        Create Cuisine
                    </Button>
                </div>
            </CuisineForm>
        </AdaptiveCard>
    )
}

export default CuisineCreate
