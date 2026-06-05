import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ColumnDef, Row } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { NumericFormat } from 'react-number-format'
import cloneDeep from 'lodash/cloneDeep'
import {
    useDeleteDish,
    useDishList,
    useUpdateDish,
} from '@/utils/custom-hooks/useDish'
import DishColumn from './DishColumn'
import ActionColumn from './ActionColumn'
import type { TableQueries } from '@/views/dishes/types/dish.type'
import { Dish, GetDishListResponse } from '@/@types/dish'
import { Cuisine } from '@/@types/restaurant'
import { useDishStore } from '@/store/dishStore'
import DishStatusBadge from './DishStatusBadge'
import DishAvailableStatusBadge from './DishAvailableStatusBadge'

type DishStatus = 'available' | 'unavailable'

const DishListTable = ({
    dishList,
    dishListTotal,
    isLoading,
}: {
    dishList: Dish[]
    dishListTotal: number
    isLoading: boolean
}) => {
    const navigate = useNavigate()
    // const {
    //     dishList,
    //     dishListTotal,
    //     // tableData,
    //     // setTableData,
    //     isLoading,
    //     // deleteMutation,
    // } = useDishList()
    const tableData = useDishStore((state) => state.tableData)
    const setTableData = useDishStore((state) => state.setTableData)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<string | null>(null)
    console.log('Dish list: ', dishList)

    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )

    const { mutate: deleteDish } = useDeleteDish()
    const { mutate: updateDish } = useUpdateDish()

    const confirmDelete = () => {
        deleteDish(toDeleteId!)
        setDeleteConfirmationOpen(false)
        setToDeleteId(null)

        // if (toDeleteId) {
        //     // deleteMutation.mutate(toDeleteId)
        //     setDeleteConfirmationOpen(false)
        //     setToDeleteId(null)
        // }
    }

    const columns: ColumnDef<Dish & { cuisine: Cuisine }>[] = useMemo(() => {
        const handleView = (dishId: string) => {
            navigate(`/dishes/detail/${dishId}`)
        }

        const handleEdit = (dish: Dish) => {
            navigate(`/dishes/edit/${dish.id}`)
        }

        const handleDelete = (id: string) => {
            setToDeleteId(id)
            setDeleteConfirmationOpen(true)
        }

        const handleStatusChange = async (
            id: string,
            newStatus: DishStatus,
        ) => {
            setStatusUpdatingId(id)
            updateDish({
                dishId: id,
                data: {
                    availableForOrder: newStatus === 'available' ? true : false,
                },
            })
        }
        return [
            {
                header: 'Dish',
                accessorKey: 'name',
                cell: (props) => <DishColumn row={props.row.original} />,
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => (
                    <span className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={props.row.original.price}
                            prefix="MMK "
                        />
                    </span>
                ),
            },
            {
                header: 'Category',
                id: 'cuisine.name',
                cell: (props) => <span>{props.row.original.cuisine.name}</span>,
            },
            {
                header: 'Status',
                id: 'availableForOrder',
                cell: (props) => {
                    console.log('Props: ', props)
                    const { id, availableForOrder } = props.row.original
                    return (
                        <DishAvailableStatusBadge
                            status={
                                availableForOrder ? 'available' : 'unavailable'
                            }
                            isLoading={statusUpdatingId === id}
                            onChange={(newStatus: DishStatus) =>
                                handleStatusChange(id, newStatus)
                            }
                        />
                        // <span
                        //     className={`px-2 py-1 rounded-full text-xs ${props.row.original.availableForOrder ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        // >
                        //     {props.row.original.availableForOrder
                        //         ? 'Available'
                        //         : 'Unavailable'}
                        // </span>
                    )
                },
            },

            {
                header: 'PrepTime',
                accessorKey: 'preparationTime',
                cell: (props) => {
                    // console.log('Props: ', props)
                    return (
                        <span>
                            {props.row.original.preparationTime ?? 'Unknown'}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() => handleView(props.row.original.id)}
                        onEdit={() => handleEdit(props.row.original)}
                        // onDelete={() => handleDelete(props.row.original.id)}
                    />
                ),
            },
        ]
    }, [navigate, statusUpdatingId, updateDish])

    // const handleSetTableData = (data: TableQueries) => {
    //     setTableData(data)
    // }

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const handleSelectChange = (size: number) => {
        setTableData((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
    }

    const handleSort = (sort: any) => {
        console.log('Sort: ', sort)
        setTableData((prev) => ({
            ...prev,
            sort: {
                key: sort.key,
                order: sort.order,
            },
            pageIndex: 1,
        }))
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={dishList}
                loading={isLoading}
                pagingData={{
                    total: dishListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Dish"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                <p>
                    Are you sure you want to remove this dish? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DishListTable
