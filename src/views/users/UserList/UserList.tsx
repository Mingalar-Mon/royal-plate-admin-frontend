import { useUserTableStore } from '@/store/userStore'
import { useUserListQuery } from '@/utils/custom-hooks/useUser'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
// import UserListActionTools from './components/UserListActionTools'
// import UserListActionTools from '@/views/users/UserList/components/UserListActionTools'
import UserListTableTools from './components/UserListTableTools'
import UserListTable from './components/UserListTable'

const UserList = () => {
    // ✅ Pull the unified table queries parameter snapshot from store
    const tableData = useUserTableStore((state) => state.tableData)

    const { data, isLoading } = useUserListQuery(tableData)

    const usersList = data?.data || []
    const usersTotal = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Registered App Users</h3>
                        {/* <UserListActionTools data={usersList} /> */}
                    </div>
                    <UserListTableTools />
                    <UserListTable
                        data={usersList}
                        total={usersTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default UserList
