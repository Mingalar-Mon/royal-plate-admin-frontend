import { create } from 'zustand'

export interface AppVersionQueries {
    pageIndex: number
    pageSize: number
    query: string
}

interface AppVersionStoreState {
    tableData: AppVersionQueries
    setTableData: (
        updater: (prev: AppVersionQueries) => AppVersionQueries,
    ) => void
    resetFilters: () => void
}

export const useAppVersionStore = create<AppVersionStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
    },
    setTableData: (updater) =>
        set((state) => ({
            tableData: updater(state.tableData),
        })),
    resetFilters: () =>
        set({
            tableData: { pageIndex: 1, pageSize: 10, query: '' },
        }),
}))
