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
    setTableData: (updater: (prev: DishQueries) => DishQueries) => void
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

    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),

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
