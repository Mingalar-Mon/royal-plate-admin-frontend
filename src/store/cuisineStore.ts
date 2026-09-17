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
    setTableData: (updater: (prev: CuisineQueries) => CuisineQueries) => void
    resetFilters: () => void
}

export const useCuisineStore = create<CuisineStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        status: 'all',
        sort: { key: 'created_at', order: 'asc' },
    },
    setTableData: (updater) =>
        set((state) => ({
            tableData: updater(state.tableData),
        })),
    resetFilters: () =>
        set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                status: 'all',
                sort: { key: '', order: '' },
            },
        }),
}))
