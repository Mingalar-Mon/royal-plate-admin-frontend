import { useState, useMemo, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

import {
    // OrderTableData,
    // useOrderList,
    useUpdateOrderStatus,
} from '@/utils/custom-hooks/useOrder'
import OrderColumn from './OrderColumn'
import ActionColumn from './ActionColumn'

// import { orderStatusColor } from '@/utils/Status/orderStatus'
import { Order, OrderStatus } from '@/@types/order'
import { Select } from '@/components/ui'

import OrderStatusBadge from './OrderStatusBadge'
import { useOrderStore } from '@/store/orderStore'

/*
const PaymentMethodImage = ({ method }: { method: string }) => {
    const icons: Record<string, string> = {
        cash: '💰',
        card: '💳',
        mobile: '📱',
    }
    return <span className="text-lg mr-1">{icons[method] || '💵'}</span>
}

const allowedStatuses = [
    { value: 'accepted', label: 'Accepted' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'no_show', label: 'No Show' },
    // { value: 'pending', label: 'Pending' },
]

const baseAllowedOptions = [
    { value: 'accepted', label: 'Accepted' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'no_show', label: 'No Show' },
]
*/
interface Props {
    orderList: Order[]
    orderListTotal: number
    // tableData: TableQueries
    // setTableData: Dispatch<SetStateAction<OrderTableData>>
    isLoading: boolean
}

const OrderListTable = ({
    orderList,
    orderListTotal,
    // tableData,
    // setTableData,
    isLoading,
}: Props) => {
    const navigate = useNavigate()
    const { mutate: updateStatus } = useUpdateOrderStatus()
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )
    const tableData = useOrderStore((state) => state.tableData)
    const setTableData = useOrderStore((state) => state.setTableData)
    // const {
    //     orderList,
    //     orderListTotal,
    //     tableData,
    //     setTableData,
    //     isLoading,
    //     // deleteMutation,
    // } = useOrderList()
    // console.log('Order list: ', orderList)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<string | null>(null)

    const handleDelete = (id: string) => {
        setToDeleteId(id)
        setDeleteConfirmationOpen(true)
    }

    const confirmDelete = () => {
        if (toDeleteId) {
            // deleteMutation.mutate(toDeleteId)
            setDeleteConfirmationOpen(false)
            setToDeleteId(null)
        }
    }

    const columns: ColumnDef<Order>[] = useMemo(() => {
        const handleView = (order: Order) => {
            navigate(`/orders/${order.id}`)
        }

        // const handleEdit = (order: Order) => {
        //     navigate(`/orders/edit/${order.id}`)
        // }
        const handleStatusChange = async (
            id: string,
            newStatus: OrderStatus,
        ) => {
            setStatusUpdatingId(id)
            updateStatus({ orderId: id, status: newStatus })
            setStatusUpdatingId(null)
        }
        return [
            {
                header: 'Order',
                accessorKey: 'orderNumber',
                cell: (props) => {
                    // console.log(
                    //     'Rendering order column for: ',
                    //     props.row.original,
                    // )
                    return <OrderColumn row={props.row.original} />
                },
            },
            {
                header: 'Date',
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="font-semibold">
                        {dayjs(props.row.original.created_at).format(
                            'DD/MM/YYYY',
                        )}

                        {/* {dayjs
                            .unix(props.row.original.created_at)
                            .format('DD/MM/YYYY')} */}
                    </span>
                ),
            },
            {
                header: 'Customer',
                id: 'name',

                cell: (props) => (
                    <div>
                        <span className="font-semibold">
                            {props.row.original.user.name}
                        </span>
                        <div className="text-xs text-gray-500">
                            {props.row.original.user.phone ||
                                props.row.original.user.email ||
                                '-'}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Status',
                id: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    const orderId = props.row.original.id

                    return (
                        <OrderStatusBadge
                            status={status}
                            isLoading={statusUpdatingId === orderId}
                            onChange={(newStatus: OrderStatus) =>
                                handleStatusChange(orderId, newStatus)
                            }
                        />
                    )

                    // return (

                    // <Tag className={orderStatusColor[status]?.bgClass}>
                    //     <span
                    //         className={`capitalize font-semibold ${orderStatusColor[status]?.textClass}`}
                    //     >
                    //         {orderStatusColor[status]?.label}
                    //     </span>
                    // </Tag>
                    // )
                },
            },
            {
                header: 'Pick Up',
                accessorKey: 'scheduledDate',
                cell: (props) => (
                    <div className="flex items-center gap-1">
                        <span className="capitalize">
                            {new Date(
                                props.row.original.scheduledDate,
                            ).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                hour12: true,
                            })}
                        </span>
                    </div>
                ),
            },
            /*
            {
                header: 'Payment',
                accessorKey: 'paymentMethod',
                cell: (props) => (
                    <div className="flex items-center gap-1">
                        <PaymentMethodImage
                            method={props.row.original.paymentMethod as string}
                        />
                        <span className="capitalize">
                            {props.row.original.paymentMethod}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Total',
                accessorKey: 'total',
                cell: (props) => (
                    <NumericFormat
                        thousandSeparator
                        className="heading-text font-bold"
                        displayType="text"
                        value={props.row.original.totalPrice}
                        prefix="MMK "
                    />
                ),
            },
            */
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() => handleView(props.row.original)}
                        // onEdit={() => handleEdit(props.row.original)}
                        // onDelete={() => handleDelete(props.row.original.id)}
                    />
                ),
            },
        ]
    }, [navigate, updateStatus, statusUpdatingId])

    // const handleSetTableData = (data: TableQueries) => setTableData(data)
    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
        // const newData = cloneDeep(tableData)
        // newData.pageIndex = page
        // handleSetTableData(newData)
    }
    const handleSelectChange = (size: number) => {
        setTableData((prev: any) => ({ ...prev, pageSize: size, pageIndex: 1 }))
        // const newData = cloneDeep(tableData)
        // newData.pageSize = size
        // newData.pageIndex = 1
        // handleSetTableData(newData)
    }
    const handleSort = (sort: any) => {
        setTableData((prev: any) => ({ ...prev, sort }))
        // const newData = cloneDeep(tableData)
        // newData.sort = sort
        // handleSetTableData(newData)
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={orderList}
                loading={isLoading}
                pagingData={{
                    total: orderListTotal,
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
                title="Delete Order"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                <p>
                    Are you sure you want to delete this order? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default OrderListTable
