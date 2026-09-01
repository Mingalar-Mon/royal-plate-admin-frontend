import { create } from 'zustand'
import type { CommissionQuery } from '@/@types/commission'

interface CommissionStoreState {
    tableData: CommissionQuery
    setTableData: (
        updater: (prev: CommissionQuery) => CommissionQuery,
    ) => void
    resetFilters: () => void
}

const initialTableData: CommissionQuery = {
    page: 1,
    limit: 10,
    sortKey: 'created_at',
    sortOrder: 'DESC',
    search: '',
}

export const useCommissionStore = create<CommissionStoreState>((set) => ({
    tableData: initialTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => set({ tableData: { ...initialTableData } }),
}))
