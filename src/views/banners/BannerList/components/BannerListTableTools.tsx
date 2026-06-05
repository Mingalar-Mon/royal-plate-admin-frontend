import BannerListSearch from './BannerListSearch'
import BannerFilter from './BannerFilter'

import { useBannerStore } from '@/store/bannerStore'

const BannerListTableTools = () => {
    const setTableData = useBannerStore((state) => state.setTableData)

    const handleSearch = (val: string) => {
        // ✅ Updates text inputs configurations via functional callback arrays parameters safely
        setTableData((prev) => ({
            ...prev,
            query: val,
            pageIndex: 1, // Reset page pointer back to 1 on input filtering spikes
        }))
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <BannerListSearch onSearch={handleSearch} />
            {/* <BannerFilter /> */}
        </div>
    )
}

export default BannerListTableTools
