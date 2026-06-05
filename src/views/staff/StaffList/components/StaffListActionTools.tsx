import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import { CSVLink } from 'react-csv'
import { useStaffList } from '@/utils/custom-hooks/useStaff'
import { Staff } from '@/services/RestaurantStaffService'

const StaffListActionTools = ({
    staffList,
    restaurantId,
}: {
    staffList: Staff[]
    restaurantId: string
}) => {
    const navigate = useNavigate()
    // const { restaurantId } = useParams()
    // const { staffList } = useStaffList(restaurantId!)

    return (
        <div className="flex gap-3">
            <CSVLink filename="staff.csv" data={staffList}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() =>
                    navigate(`/restaurants/${restaurantId}/staff/create`)
                }
            >
                Add Staff
            </Button>
        </div>
    )
}

export default StaffListActionTools
