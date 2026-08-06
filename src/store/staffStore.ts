import { OnSortParam } from './../components/shared/DataTable'
import { create } from 'zustand'
import type { OnSortParam } from '@/components/shared/DataTable'

export interface TableQueries {
    pageIndex: number
    pageSize: number
    query: string
    role: string
    sort?: OnSortParam //{ key: string; order: 'asc' | 'desc' }
}

interface StaffTableState {
    tableData: TableQueries
    setTableData: (updater: (prev: TableQueries) => TableQueries) => void
    // setTableData: (data: Partial<TableQueries>) => void
    resetFilters: () => void
}

export const useStaffStore = create<StaffTableState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        role: '',
        sort: { key: 'name', order: 'asc' },
    },
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),

    resetFilters: () =>
        set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                role: '',
                sort: { key: 'name', order: 'asc' },
            },
        }),
}))
