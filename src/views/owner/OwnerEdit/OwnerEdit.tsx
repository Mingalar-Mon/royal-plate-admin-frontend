import { useParams, useNavigate } from 'react-router'
import {
    useOwnerDetailQuery,
    useUpdateOwner,
} from '@/utils/custom-hooks/useOwner'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import OwnerEditForm, {
    type OwnerEditFormData,
} from './components/OwnerEditForm'

const OwnerEdit = () => {
    console.log('Owner edit got rendered')
    const { id } = useParams()
    const navigate = useNavigate()

    // 1. Fetch live profile dataset snapshot fields out of server caches
    const { data: ownerResponse, isLoading } = useOwnerDetailQuery(id!)
    const { mutate: updateOwner, isPending: isUpdating } = useUpdateOwner()

    if (isLoading)
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )

    const owner = ownerResponse?.data
    if (!owner)
        return <div className="p-8 text-center">Owner profile not found</div>

    const defaultValues: Partial<OwnerEditFormData> = {
        name: owner.name,
        email: owner.email,
        phone: owner.phone || '',
        password: '', // Kept empty for safety
    }

    const handleSubmit = (formData: OwnerEditFormData) => {
        // 2. Filter out properties maps to protect against overwriting active passwords with blanks
        const payload: any = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
        }

        if (formData.password) {
            payload.password = formData.password
        }

        updateOwner(
            { id: id!, data: payload },
            {
                onSuccess: () => navigate(`/owners/${id}`),
            },
        )
    }

    return (
        <AdaptiveCard>
            <OwnerEditForm
                defaultValues={defaultValues}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate(`/owners/${id}`)}
                    >
                        Back
                    </Button>
                    <Button type="submit" variant="solid" loading={isUpdating}>
                        Save Changes
                    </Button>
                </div>
            </OwnerEditForm>
        </AdaptiveCard>
    )
}

export default OwnerEdit
