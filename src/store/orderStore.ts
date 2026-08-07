import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface OrderQueries {
    pageIndex: number
    pageSize: number
    query: string
    status: string
    sort?: OnSortParam
    pickUpDate: string
    fromDate: string
    toDate: string
}

interface OrderStoreState {
    tableData: OrderQueries
    setTableData: (updater: (prev: OrderQueries) => OrderQueries) => void
    resetFilters: () => void
}

export const useOrderStore = create<OrderStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        status: 'all',
        query: '',
        pickUpDate: '',
        fromDate: '',
        toDate: '',
        sort: { key: 'scheduledDate', order: 'desc' }, // Clean default sorting path
    },
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => {
        return set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                status: 'all',
                query: '',
                pickUpDate: '',
                fromDate: '',
                toDate: '',
            },
        })
    },
}))
