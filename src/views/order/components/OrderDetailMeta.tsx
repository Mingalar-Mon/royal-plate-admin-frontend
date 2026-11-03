import Card from '@/components/ui/Card'
import { TbAlertTriangle, TbNotes } from 'react-icons/tb'
import { Order } from '@/@types/order'

interface OrderDetailMetaProps {
    order: Order
}

const terminalStatuses = new Set(['canceled', 'rejected'])

const OrderDetailMeta = ({ order }: OrderDetailMetaProps) => {
    const hasRemark = Boolean(order.remark?.trim())
    const hasCancellation =
        Boolean(order.cancellationReason?.trim()) ||
        terminalStatuses.has(order.status)

    if (!hasRemark && !hasCancellation) return null

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbNotes className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Order Notes
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div className="space-y-4">
                {hasRemark && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Remarks
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            {order.remark}
                        </p>
                    </div>
                )}

                {hasCancellation && (
                    <div
                        className={
                            hasRemark
                                ? 'pt-4 border-t border-gray-200 dark:border-gray-700'
                                : ''
                        }
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TbAlertTriangle className="text-red-500" />
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                Cancellation
                            </p>
                        </div>
                        <div className="space-y-2 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
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
