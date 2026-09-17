import { create } from 'zustand'

export type OwnerStatus = 'active' | 'inactive' | 'all'

export interface TableQueries {
    pageIndex: number
    pageSize: number
    query: string
    status: OwnerStatus
    sort?: {
        key: string
        order: 'asc' | 'desc'
    }
}

interface OwnerStoreState {
    tableData: TableQueries
    setTableData: (updater: (prev: TableQueries) => TableQueries) => void
    resetFilters: () => void
}

export const useOwnerStore = create<OwnerStoreState>((set) => ({
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
