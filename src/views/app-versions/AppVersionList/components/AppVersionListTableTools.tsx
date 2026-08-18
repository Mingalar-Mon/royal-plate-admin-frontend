import AppVersionListSearch from './AppVersionListSearch'
import { useAppVersionStore } from '@/store/appVersionStore'

const AppVersionListTableTools = () => {
    const setTableData = useAppVersionStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1, // Reset page pointer back to 1 on new searches
        }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <AppVersionListSearch onSearch={handleSearch} />
        </div>
    )
}

export default AppVersionListTableTools
