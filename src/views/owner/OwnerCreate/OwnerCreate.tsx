import { useNavigate } from 'react-router'
import { useCreateOwner } from '@/utils/custom-hooks/useOwner'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import OwnerCreateForm, {
    type OwnerCreateFormData,
} from './components/OwnerCreateForm'

const OwnerCreate = () => {
    const navigate = useNavigate()
    const { mutate: createOwner, isPending } = useCreateOwner()

    const handleSubmit = (formData: OwnerCreateFormData) => {
        // Prepare data package mappings safely into payload shapes
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            code: formData.code || undefined,
        }

        createOwner(
            { data: payload },
            {
                onSuccess: () => {
                    navigate('/owners') // Route back to the master list table view grid
                },
            },
        )
    }

    return (
        <AdaptiveCard>
            <OwnerCreateForm onFormSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/owners')}
                    >
                        Back to Owners
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isPending} // Natively bind React Query execution loader state
                    >
                        Register Owner
                    </Button>
                </div>
            </OwnerCreateForm>
        </AdaptiveCard>
    )
}

export default OwnerCreate
