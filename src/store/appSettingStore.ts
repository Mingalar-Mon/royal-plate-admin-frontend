import { create } from 'zustand'

export interface AppSettingQueries {
    pageIndex: number
    pageSize: number
    query: string
}

interface AppSettingStoreState {
    tableData: AppSettingQueries
    setTableData: (
        updater: (prev: AppSettingQueries) => AppSettingQueries,
    ) => void
    resetFilters: () => void
}

export const useAppSettingStore = create<AppSettingStoreState>((set) => ({
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
