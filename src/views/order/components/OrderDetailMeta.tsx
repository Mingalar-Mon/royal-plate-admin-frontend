import Card from '@/components/ui/Card'
import { TbAlertTriangle, TbNotes } from 'react-icons/tb'
import { Order } from '@/@types/order'

interface OrderDetailMetaProps {
    order: Order
}

const terminalStatuses = new Set(['canceled', 'rejected', 'no_show'])

const OrderDetailMeta = ({ order }: OrderDetailMetaProps) => {
    const hasRemark = Boolean(order.remark?.trim())
    const hasCancellation =
        Boolean(order.cancellationReason?.trim()) ||
        terminalStatuses.has(order.status)

    if (!hasRemark && !hasCancellation) return null

    return (
        <Card>
            <div className="space-y-4">
                {hasRemark && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TbNotes className="text-gray-500" />
                            <h4 className="mb-0">Remarks</h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {order.remark}
                        </p>
                    </div>
                )}

                {hasCancellation && (
                    <div
                        className={
                            hasRemark
                                ? 'pt-4 border-t border-gray-200 dark:border-gray-600'
                                : ''
                        }
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TbAlertTriangle className="text-red-500" />
                            <h4 className="mb-0">Cancellation</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            {order.cancellationReason && (
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {order.cancellationReason}
                                </p>
                            )}
                            {order.cancelledByType && (
                                <div className="text-gray-500 dark:text-gray-400">
                                    Cancelled by:{' '}
                                    <span className="font-medium capitalize text-gray-700 dark:text-gray-200">
                                        {order.cancelledByType}
                                    </span>
                                </div>
                            )}
                            {!order.cancellationReason &&
                                !order.cancelledByType && (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        This order was{' '}
                                        {order.status.replace(/_/g, ' ')}.
                                    </p>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default OrderDetailMeta
