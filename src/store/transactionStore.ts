import { create } from 'zustand'
import dayjs from 'dayjs'
import type { TransactionQueries } from '@/@types/transaction'

interface TransactionStoreState {
    tableData: TransactionQueries
    setTableData: (
        updater: (prev: TransactionQueries) => TransactionQueries,
    ) => void
    resetFilters: () => void
}

const defaultTableData: TransactionQueries = {
    page: 1,
    limit: 10,
    month: dayjs().format('YYYY-MM'),
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
    tableData: defaultTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () =>
        set({
            tableData: { ...defaultTableData },
        }),
}))