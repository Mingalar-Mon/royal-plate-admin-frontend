import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface BannerQueries {
    pageIndex: number
    pageSize: number
    query: string
    type: string
    sort?: OnSortParam
}

interface BannerStoreState {
    tableData: BannerQueries
    setTableData: (updater: (prev: BannerQueries) => BannerQueries) => void
    resetFilters: () => void
}

export const useBannerStore = create<BannerStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        type: '',
    },
    setTableData: (updater) =>
        set((state) => ({
            tableData: updater(state.tableData),
        })),
    resetFilters: () =>
        set({
            tableData: { pageIndex: 1, pageSize: 10, query: '', type: '' },
        }),
}))
