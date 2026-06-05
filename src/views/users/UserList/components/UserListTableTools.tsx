import { useUserTableStore } from '@/store/userStore'
import UserListSearch from './UserListSearch'
import UserFilter from './UserFilter'

const UserListTableTools = () => {
    const setTableData = useUserTableStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        // ✅ Direct functional update wipes out local cloneDeep noise completely
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1, // Reset page index on search inputs modifications
        }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <UserListSearch onSearch={handleSearch} />
            {/* <UserFilter /> */}
        </div>
    )
}
export default UserListTableTools
