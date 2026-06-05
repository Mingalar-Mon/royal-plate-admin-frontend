import { OnSortParam } from '@/components/shared/DataTable'
import { create } from 'zustand'

export interface UserTableQueries {
    pageIndex: number
    pageSize: number
    query: string
    isVerified: string
    gender: string
    sort?: OnSortParam
}

interface UserStoreState {
    tableData: UserTableQueries
    setTableData: (
        updater: (prev: UserTableQueries) => UserTableQueries,
    ) => void
    resetFilters: () => void
}

export const useUserTableStore = create<UserStoreState>((set) => ({
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        isVerified: '',
        gender: '',
        sort: { key: 'createdAt', order: 'desc' }, // Clean baseline sorting order
    },
    setTableData: (updater) =>
        set((state) => ({
            tableData: updater(state.tableData),
        })),
    resetFilters: () =>
        set({
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                isVerified: '',
                gender: '',
                sort: { key: 'createdAt', order: 'desc' },
            },
        }),
}))
