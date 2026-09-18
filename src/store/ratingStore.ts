import type { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export type RatingResponseFilter = 'all' | 'pending' | 'replied'

export interface RatingQueries {
    pageIndex: number
    pageSize: number
    query: string
    response: RatingResponseFilter
    sort?: OnSortParam
}

interface RatingStoreState {
    tableData: RatingQueries
    setTableData: (
        updater: (previous: RatingQueries) => RatingQueries,
    ) => void
    resetFilters: () => void
}

const defaultTableData: RatingQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    response: 'all',
}

export const useRatingStore = create<RatingStoreState>((set) => ({
    tableData: defaultTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => set({ tableData: { ...defaultTableData } }),
}))
