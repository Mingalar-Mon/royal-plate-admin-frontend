import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface TableQueries {
    pageIndex: number
    pageSize: number
    query: string
    type: string
    status: string
    sort?: OnSortParam
}

interface TableStoreState {
    tableData: TableQueries
    setTableData: (updater: (prev: TableQueries) => TableQueries) => void
    resetFilters: () => void
}

export const useTableStore = create<TableStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        type: '',
        status: '',
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
                type: '',
                status: '',
                sort: { key: 'created_at', order: 'asc' },
            },
        }),
}))
