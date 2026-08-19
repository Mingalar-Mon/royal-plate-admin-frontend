import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import StaffListActionTools from './components/StaffListActionTools'
import StaffListTableTools from './components/StaffListTableTools'
import StaffListTable from './components/StaffListTable'
import { useParams } from 'react-router'
import { useStaffList } from '@/utils/custom-hooks/useStaff'
import { useStaffStore } from '@/store/staffStore'

const StaffList = () => {
    const { restaurantId } = useParams()
    console.log('Back in staff list components')

    const tableData = useStaffStore((state) => state.tableData)

    const { staffList, isLoading, total, refetch } = useStaffList({
        restaurantId: restaurantId!,
        params: tableData,
    })
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className='text-primary'>Staff Members</h3>
                        <StaffListActionTools onRefresh={refetch} />
                    </div>
                    <StaffListTableTools
                    // tableData={tableData}
                    // setTableData={setTableData}
                    />
                    <StaffListTable
                        staffList={staffList}
                        total={total}
                        // tableData={tableData}
                        // setTableData={setTableData}
                        isLoading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default StaffList
