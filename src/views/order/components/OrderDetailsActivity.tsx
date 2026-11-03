import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import classNames from '@/utils/classNames'
import { toRestaurantTime } from '@/utils/orderDate'
import { TbClock, TbCheck } from 'react-icons/tb'

interface OrderDetailsActivitiesProps {
    order: {
        status: string
        created_at: string
        confirmed_at?: string
        preparing_at?: string
        ready_at?: string
        completed_at?: string
        terminated_at?: string
    }
    status?: string
    createdAt?: string
}

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    canceled: 'Canceled',
    rejected: 'Rejected',
}

const formatLabel = (step: string) =>
    statusLabels[step] ||
    step.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const OrderDetailsActivities = ({ order }: OrderDetailsActivitiesProps) => {
    const status = order.status

    const standardFlow = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'completed',
    ]

    const isTerminated = status === 'canceled' || status === 'rejected'

    const displayFlow = isTerminated ? ['pending', status] : standardFlow
    const currentIndex = displayFlow.indexOf(status)

    const timestampMap: Record<string, string | undefined | null> = {
        pending: order.created_at,
        confirmed: order.confirmed_at,
        preparing: order.preparing_at,
        ready: order.ready_at,
        completed: order.completed_at,
        canceled: order.terminated_at,
        rejected: order.terminated_at,
    }

    const activities = displayFlow.map((step, idx) => ({
        key: step,
        name: formatLabel(step),
        completed: currentIndex >= 0 ? idx <= currentIndex : false,
        isCurrent: step === status,
        date: timestampMap[step] || null,
        isTerminalStep: isTerminated && step !== 'pending',
    }))

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbClock className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Order Timeline
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <Timeline>
                {activities.map((act) => (
                    <Timeline.Item
                        key={act.key}
                        media={
                            <Badge
                                className={classNames(
                                    act.isCurrent &&
                                        'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800',
                                )}
                                innerClass={
                                    act.completed
                                        ? act.isTerminalStep
                                            ? 'bg-red-500'
                                            : 'bg-emerald-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }
                            />
                        }
                    >
                        <div
                            className={classNames(
                                'flex items-center gap-2 capitalize text-sm',
                                act.isCurrent
                                    ? 'font-bold text-gray-900 dark:text-gray-100'
                                    : act.completed
                                      ? 'font-semibold text-gray-800 dark:text-gray-200'
                                      : 'font-medium text-gray-500 dark:text-gray-400',
                            )}
                        >
                            {act.name}
                            {act.isCurrent && (
                                <TbCheck className="text-emerald-500 text-sm" />
                            )}
                        </div>
                        {act.date ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {toRestaurantTime(act.date)?.format(
                                    'DD/MM/YYYY HH:mm',
                                )}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {act.completed ? '—' : 'Pending'}
                            </div>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Current Status:
                    </span>
                    <span className={`font-semibold capitalize px-2 py-0.5 rounded-full ${
                        status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : status === 'canceled' || status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : status === 'pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                        {status}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default OrderDetailsActivities
