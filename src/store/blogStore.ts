import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface BlogTableQueries {
    pageIndex: number
    pageSize: number
    query: string
    sort?: OnSortParam
}

interface BlogStoreState {
    tableData: BlogTableQueries
    setTableData: (
        updater: (prev: BlogTableQueries) => BlogTableQueries,
    ) => void
    resetFilters: () => void
}

export const useBlogStore = create<BlogStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 12,
        query: '',
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
                pageSize: 12,
                query: '',
                sort: { key: 'created_at', order: 'desc' },
            },
        }),
}))
