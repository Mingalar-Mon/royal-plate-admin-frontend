import { useParams, useNavigate } from 'react-router'
import { useCreateTableMutation } from '@/utils/custom-hooks/useTable'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import TableForm from '../components/TableForm' // Form path

const TableCreate = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()

    const { mutate: createTable, isPending } = useCreateTableMutation()

    const handleSubmit = (formData: any) => {
        if (!restaurantId) return

        createTable(
            {
                restaurantId,
                data: formData, // JSON object maps perfectly to backend parameters
            },
            {
                onSuccess: () =>
                    navigate(`/restaurants/${restaurantId}/tables`),
            },
        )
    }

    return (
        <AdaptiveCard>
            <TableForm onFormSubmit={handleSubmit} isNew={true}>
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/tables`)
                        }
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isPending} // Handled cleanly via mutation loading states
                    >
                        Create Table
                    </Button>
                </div>
            </TableForm>
        </AdaptiveCard>
    )
}

export default TableCreate
