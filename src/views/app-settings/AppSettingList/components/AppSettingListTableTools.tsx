import AppSettingListSearch from './AppSettingListSearch'
import AppSettingListActionTools from './AppSettingListActionTools'
import { useAppSettingStore } from '@/store/appSettingStore'

const AppSettingListTableTools = () => {
    const setTableData = useAppSettingStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1, // Reset page pointer back to 1 on new searches
        }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <AppSettingListSearch onSearch={handleSearch} />
            <AppSettingListActionTools />
        </div>
    )
}

export default AppSettingListTableTools
