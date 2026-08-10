import type { OnSortParam } from '@/components/shared/DataTable'
import type { ReservationStatus } from '@/views/reservations/types/reservation.type'
import { create } from 'zustand'

export interface ReservationQueries {
    pageIndex: number
    pageSize: number
    query: string
    status: ReservationStatus | ''
    dateFrom: string
    dateTo: string
    sort?: OnSortParam
}

interface ReservationStoreState {
    tableData: ReservationQueries
    setTableData: (
        updater: (prev: ReservationQueries) => ReservationQueries,
    ) => void
    resetFilters: () => void
}

export const useReservationStore = create<ReservationStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    },
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => {
        return set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                status: '',
                dateFrom: '',
                dateTo: '',
            },
        })
    },
}))
