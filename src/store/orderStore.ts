import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'
import dayjs from 'dayjs'

export interface OrderQueries {
    pageIndex: number
    pageSize: number
    query: string
    status: string
    sort?: OnSortParam
    // pickUpDate: string
    fromDate: string
    toDate: string
}

interface OrderStoreState {
    tableData: OrderQueries
    setTableData: (updater: (prev: OrderQueries) => OrderQueries) => void
    resetFilters: () => void
}

const today = dayjs().format('YYYY-MM-DD')

const defaultTableData: OrderQueries = {
    pageIndex: 1,
    pageSize: 9,
    status: 'all',
    query: '',
    // pickUpDate: today,
    fromDate: today,
    toDate: today,
    sort: { key: 'scheduledDate', order: 'desc' },
}

export const useOrderStore = create<OrderStoreState>((set) => ({
    tableData: defaultTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => {
        return set({
            tableData: { ...defaultTableData },
        })
    },
}))
