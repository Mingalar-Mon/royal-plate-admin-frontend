import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface DishQueries {
    pageIndex: number
    pageSize: number
    query?: string
    minPrice?: number | string
    maxPrice?: number | string
    status?: string
    category?: string[]
    sort?: OnSortParam
}

interface DishStoreState {
    tableData: DishQueries
    viewMode: 'table' | 'card'
    setTableData: (updater: (prev: DishQueries) => DishQueries) => void
    setViewMode: (mode: 'table' | 'card') => void
    resetFilter: () => void
}

export const useDishStore = create<DishStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        minPrice: '',
        maxPrice: '',
        status: '',
        category: [],
    },
    viewMode: 'table',

    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),

    setViewMode: (mode) => set({ viewMode: mode }),

    resetFilter: () =>
        set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                minPrice: '',
                maxPrice: '',
                status: '',
                category: [],
            },
        }),
}))
