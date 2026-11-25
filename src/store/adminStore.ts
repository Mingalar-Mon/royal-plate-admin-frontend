import { create } from 'zustand'

export interface AdminTableQueries {
    pageIndex: number
    pageSize: number
    query: string
}

interface AdminTableState {
    tableData: AdminTableQueries
    setTableData: (
        updater: (prev: AdminTableQueries) => AdminTableQueries,
    ) => void
    resetFilters: () => void
}

const initialTableData: AdminTableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
}

export const useAdminStore = create<AdminTableState>((set) => ({
    tableData: initialTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => set({ tableData: { ...initialTableData } }),
}))
