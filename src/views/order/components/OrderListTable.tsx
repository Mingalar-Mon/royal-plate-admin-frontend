import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Dialog from '@/components/ui/Dialog'
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

import OrderStatusBadge from './OrderStatusBadge'
import { useOrderStore } from '@/store/orderStore'
import Button from '@/components/ui/Button'
import { TbCalendarEvent, TbX } from 'react-icons/tb'

/*
const PaymentMethodImage = ({ method }: { method: string }) => {
    const icons: Record<string, string> = {
        cash: '💰',
        card: '💳',
        mobile: '📱',
    }
    return <span className="text-lg mr-1">{icons[method] || '💵'}</span>
}
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
    const [statusChangePreview, setStatusChangePreview] = useState<{
        order: Order
        newStatus: OrderStatus
    } | null>(null)

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        setStatusChangePreview({ order, newStatus })
    }

    const confirmStatusChange = () => {
        if (!statusChangePreview) return

        const { order, newStatus } = statusChangePreview
        setStatusChangePreview(null)
        setStatusUpdatingId(order.id)
        updateStatus(
            { orderId: order.id, status: newStatus },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }
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
                                handleStatusChange(
                                    props.row.original,
                                    newStatus,
                                )
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
    }, [navigate, statusUpdatingId])

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

    const dateRangeActive = Boolean(tableData.fromDate || tableData.toDate)

    const handleClearDateRange = () => {
        setTableData((prev) => ({ ...prev, fromDate: '', toDate: '' }))
    }

    return (
        <>
            {dateRangeActive && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <TbCalendarEvent />
                        {tableData.fromDate
                            ? `From ${dayjs(tableData.fromDate).format(
                                  'DD/MM/YYYY',
                              )}`
                            : 'Any start date'}
                        <span className="text-primary/50">—</span>
                        {tableData.toDate
                            ? `To ${dayjs(tableData.toDate).format(
                                  'DD/MM/YYYY',
                              )}`
                            : 'Any end date'}
                    </span>
                    <Button
                        size="xs"
                        variant="plain"
                        icon={<TbX />}
                        onClick={handleClearDateRange}
                    >
                        Clear
                    </Button>
                </div>
            )}
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
            <Dialog
                isOpen={Boolean(statusChangePreview)}
                onClose={() => setStatusChangePreview(null)}
                onRequestClose={() => setStatusChangePreview(null)}
                width={480}
                contentClassName="max-h-[90vh] overflow-y-auto"
                title="Preview Order Items"
            >
                {statusChangePreview && (
                    <div className="p-4">                                <div className="mb-5 rounded-xl bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 p-4 dark:from-primary/20 dark:via-blue-950/40 dark:to-purple-950/40">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    Order Preview
                                </p>
                                <h5 className="mt-1 text-lg font-bold">
                                    #{statusChangePreview.order.orderNumber}
                                </h5>
                            </div>
                            <OrderStatusBadge
                                status={statusChangePreview.newStatus} onChange={function (status: OrderStatus): void {
                                    throw new Error('Function not implemented.')
                                }} />
                        </div>
                        {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Review the items before changing the order status.
                        </p> */}
                    </div>

                        {statusChangePreview.order.remark && (
                            <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                <span className="font-semibold">Remark:</span>{' '}
                                {statusChangePreview.order.remark}
                            </div>
                        )}

                        <div className="max-h-[45vh] overflow-y-auto pr-1">

                            {statusChangePreview.order.items.length > 0 ? (
                                statusChangePreview.order.items.map((item) => (<div
                                    key={item.id}                                            className="flex items-center justify-between border-b border-gray-200/70 py-3 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-700"

                                >                                            <div className="min-w-0">
                                                <div className="font-medium text-primary-700 dark:text-primary-300">
                                                    {item.dish.name}
                                                </div>
                                                {item.note && (
                                                    <div className="text-xs text-gray-500">
                                                        Note: {item.note}
                                                    </div>
                                                )}
                                            </div>

                                    <div className="text-right">
                                        <div className="font-semibold text-purple-700 dark:text-purple-300">
                                            x{item.quantity}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {(
                                                item.quantity * item.unitPrice
                                            ).toLocaleString()}{' '}
                                            MMK
                                        </div>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="py-6 text-center text-gray-500">
                                    No items found for this order.
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2 border-t border-primary/10 bg-white pt-4 dark:bg-gray-900">
                            <Button
                                type="button"
                                variant="default"
                                onClick={() => setStatusChangePreview(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                onClick={confirmStatusChange}
                            >
                                Change Status
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
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
