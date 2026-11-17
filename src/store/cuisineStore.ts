import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export type CuisineStatus = 'active' | 'inactive' | 'all'

export interface CuisineQueries {
    pageIndex: number
    pageSize: number
    query: string
    status: CuisineStatus
    sort?: OnSortParam
}

interface CuisineStoreState {
    tableData: CuisineQueries
    viewMode: 'table' | 'card'
    setTableData: (updater: (prev: CuisineQueries) => CuisineQueries) => void
    setViewMode: (mode: 'table' | 'card') => void
    resetFilters: () => void
}

export const useCuisineStore = create<CuisineStoreState>((set) => ({
    viewMode: 'card',
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        status: 'all',
        sort: { key: 'created_at', order: 'desc' },
    },
    setTableData: (updater) =>
        set((state) => ({
            tableData: updater(state.tableData),
        })),
    setViewMode: (mode) => set({ viewMode: mode }),
    resetFilters: () =>
        set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                status: 'all',
                sort: { key: 'created_at', order: 'desc' },
            },
        }),
}))
