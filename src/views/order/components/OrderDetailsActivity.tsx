import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'

interface OrderDetailsActivitiesProps {
    order: {
        status: string
        created_at: string
        confirmed_at?: string
        accepted_at?: string
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
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready_for_pickup: 'Ready for pickup',
    completed: 'Completed',
    canceled: 'Canceled',
    rejected: 'Rejected',
    no_show: 'No show',
}

const formatLabel = (step: string) =>
    statusLabels[step] ||
    step.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const OrderDetailsActivities = ({ order }: OrderDetailsActivitiesProps) => {
    const status = order.status

    const standardFlow = [
        'pending',
        'confirmed',
        'accepted',
        'preparing',
        'ready_for_pickup',
        'completed',
    ]

    const isTerminated =
        status === 'canceled' || status === 'rejected' || status === 'no_show'

    const displayFlow = isTerminated ? ['pending', status] : standardFlow
    const currentIndex = displayFlow.indexOf(status)

    const timestampMap: Record<string, string | undefined | null> = {
        pending: order.created_at,
        confirmed: order.confirmed_at,
        accepted: order.accepted_at,
        preparing: order.preparing_at,
        ready_for_pickup: order.ready_at,
        completed: order.completed_at,
        canceled: order.terminated_at,
        rejected: order.terminated_at,
        no_show: order.terminated_at,
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
        <Card>
            <h4 className="mb-4">Order Timeline</h4>
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
                                'capitalize text-sm',
                                act.isCurrent
                                    ? 'font-bold text-gray-900 dark:text-gray-100'
                                    : act.completed
                                      ? 'font-semibold text-gray-800 dark:text-gray-200'
                                      : 'font-medium text-gray-500 dark:text-gray-400',
                            )}
                        >
                            {act.name}
                            {act.isCurrent && (
                                <span className="ml-2 text-xs font-semibold text-primary-600 dark:text-primary-400 normal-case">
                                    Current
                                </span>
                            )}
                        </div>
                        {act.date ? (
                            <div className="text-xs text-gray-500 mt-0.5">
                                {dayjs(act.date).format('DD/MM/YYYY HH:mm')}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {act.completed ? '—' : 'Pending'}
                            </div>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    )
}

export default OrderDetailsActivities
