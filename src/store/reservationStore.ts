import type { OnSortParam } from '@/components/shared/DataTable'
import type { ReservationStatus } from '@/views/reservations/types/reservation.type'
import { create } from 'zustand'
import dayjs from 'dayjs'

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

const today = dayjs().format('YYYY-MM-DD')

const defaultTableData: ReservationQueries = {
    pageIndex: 1,
    pageSize: 12,
    query: '',
    status: '',
    dateFrom: today,
    dateTo: today,
}

export const useReservationStore = create<ReservationStoreState>((set) => ({
    tableData: defaultTableData,
    setTableData: (updater) =>
        set((state) => ({ tableData: updater(state.tableData) })),
    resetFilters: () => {
        return set({
            tableData: { ...defaultTableData },
        })
    },
}))
