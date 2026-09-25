import { useMemo } from 'react'
import { useAppSettingStore } from '@/store/appSettingStore'
import { useGetAppSettings } from '@/utils/custom-hooks/useAppSetting'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import AppSettingListTableTools from './components/AppSettingListTableTools'
import AppSettingListTable from './components/AppSettingListTable'

const AppSettingList = () => {
    const tableData = useAppSettingStore((state) => state.tableData)

    const { data, isLoading } = useGetAppSettings()

    // The list endpoint returns all records (newest first), so search
    // filtering is done client-side.
    const settings = useMemo(() => {
        const all = data?.data || []
        const query = tableData.query.trim().toLowerCase()
        if (!query) return all
        return all.filter(
            (setting) =>
                setting.key?.toLowerCase().includes(query) ||
                setting.value?.toLowerCase().includes(query) ||
                setting.type?.toLowerCase().includes(query),
        )
    }, [data, tableData.query])

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>App Settings</h3>
                    </div>
                    <AppSettingListTableTools />
                    <AppSettingListTable
                        data={settings}
                        total={settings.length}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default AppSettingList
