import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import CuisineForm from '../components/CuisineForm'
import type { CuisineFormData } from '../types/cuisine.type'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import {
    // useCuisine,
    // useUpdateCuisine,
    // useDeleteCuisine,
    useCuisineDetailQuery,
    useUpdateCuisineMutation,
    useDeleteCuisineMutation,
} from '@/utils/custom-hooks/useCuisine'
import { AdaptiveCard } from '@/components/shared'

const CuisineEdit = () => {
    console.log('Cuisine edit page')
    const { id } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    console.log('ID: ', id)

    const layoutType = useThemeStore((state) => state.layout)

    const { data: cuisineResponse, isLoading } = useCuisineDetailQuery(id!)
    const { mutate: updateCuisine, isPending: isUpdating } =
        useUpdateCuisineMutation()
    const { mutate: deleteCuisine } = useDeleteCuisineMutation()

    if (isLoading) return <div className="p-8 text-center">Loading...</div>

    const cuisine = cuisineResponse?.data
    if (!cuisine)
        return <div className="p-8 text-center">Cuisine not found</div>

    const defaultValues = {
        name: cuisine.name,
        image: cuisine.image,
        description: cuisine.description || '',
    }

    const handleSubmit = async (data: CuisineFormData) => {
        const body = new FormData()
        body.append('name', data.name)
        if (data.description) body.append('description', data.description)

        // Only append file streams if a brand-new image was explicitly uploaded
        if (data.image instanceof File) {
            body.append('image', data.image)
        } else {
            // Otherwise preserve your existing S3 string url reference token
            body.append('existingImageUrl', data.image as string)
        }

        updateCuisine(
            { id: id!, data: body },
            {
                onSuccess: () => navigate('/cuisines'),
            },
        )
    }

    const handleDelete = () => {
        deleteCuisine(id!, {
            onSuccess: () => navigate('/cuisines'),
        })
        setDeleteConfirmationOpen(false)
    }

    return (
        <AdaptiveCard>
            <CuisineForm
                defaultValues={defaultValues}
                isNew={false}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/cuisines')}
                    >
                        Back to Cuisines
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500"
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
            </CuisineForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Cuisine"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete this cuisine? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </AdaptiveCard>
    )
}

export default CuisineEdit
