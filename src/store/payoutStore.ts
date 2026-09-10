import { create } from 'zustand'
import type { PayoutQueries } from '@/@types/payout'

interface PayoutStoreState {
    tableData: PayoutQueries
    setTableData: (
        updater: (prev: PayoutQueries) => PayoutQueries,
    ) => void
    resetFilters: () => void
}

const defaultTableData: PayoutQueries = {
    page: 1,
    limit: 10,
    restaurantId: '',
}

export const usePayoutStore = create<PayoutStoreState>((set) => ({
    tableData: defaultTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () =>
        set({
            tableData: { ...defaultTableData },
        }),
}))