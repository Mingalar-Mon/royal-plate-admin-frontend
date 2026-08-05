import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'

const StaffListActionTools = ({ onRefresh }: { onRefresh: () => void }) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    // const { staffList } = useStaffList(restaurantId!)

    return (
        <div className="flex gap-3">
            {/* <CSVLink filename="staff.csv" data={staffList}>
                <Button icon={<TbCloudDownload />}>Export</Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={() =>
                    navigate(`/restaurants/${restaurantId}/staff/create`)
                }
            >
                Add Staff
            </Button>
            <Button icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default StaffListActionTools
