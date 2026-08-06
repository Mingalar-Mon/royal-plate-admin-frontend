import { useBannerStore } from '@/store/bannerStore'
import { useBannerListQuery } from '@/utils/custom-hooks/useBanner'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import BannerListActionTools from './components/BannerListActionTools'
import BannerListTableTools from './components/BannerListTableTools'
import BannerListTable from './components/BannerListTable'

const BannerList = () => {
    // ✅ Extract the single global table query params configuration state from Zustand
    const tableData = useBannerStore((state) => state.tableData)

    // React Query watches 'tableData' snapshots for automated server refetching triggers
    const { data, isLoading } = useBannerListQuery(tableData)

    const bannersList = data?.data || []
    const bannersTotal = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Banners</h3>
                        <BannerListActionTools data={bannersList} />
                    </div>
                    <BannerListTableTools />
                    <BannerListTable
                        data={bannersList}
                        total={bannersTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default BannerList
