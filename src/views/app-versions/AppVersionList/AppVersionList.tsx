import { useMemo } from 'react'
import { useAppVersionStore } from '@/store/appVersionStore'
import { useGetAppVersions } from '@/utils/custom-hooks/useAppVersion'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import AppVersionListActionTools from './components/AppVersionListActionTools'
import AppVersionListTableTools from './components/AppVersionListTableTools'
import AppVersionListTable from './components/AppVersionListTable'

const AppVersionList = () => {
    const tableData = useAppVersionStore((state) => state.tableData)

    const { data, isLoading } = useGetAppVersions()

    // The list endpoint returns all records, so search filtering is done client-side.
    const versions = useMemo(() => {
        const all = data?.data || []
        const query = tableData.query.trim().toLowerCase()
        if (!query) return all
        return all.filter(
            (version) =>
                version.title?.toLowerCase().includes(query) ||
                version.versionName?.toLowerCase().includes(query) ||
                String(version.versionCode).includes(query),
        )
    }, [data, tableData.query])

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>App Versions</h3>
                        <AppVersionListActionTools />
                    </div>
                    <AppVersionListTableTools />
                    <AppVersionListTable
                        data={versions}
                        total={versions.length}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default AppVersionList
