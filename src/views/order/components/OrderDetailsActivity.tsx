// components/OrderDetailsActivities.tsx
import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
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
    status: string
    createdAt: string
}

const OrderDetailsActivities = ({
    // status,
    // createdAt,
    order,
}: OrderDetailsActivitiesProps) => {
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
        name: step.replace(/_/g, ' '),
        completed: idx <= currentIndex,
        date: timestampMap[step] || null,
    }))

    return (
        <Card>
            <h4 className="mb-4">Order Timeline</h4>
            <Timeline>
                {activities.map((act) => (
                    <Timeline.Item
                        key={act.name}
                        media={
                            <Badge
                                innerClass={
                                    act.completed
                                        ? isTerminated && act.name !== 'pending'
                                            ? 'bg-red-500' // Red badge for terminal actions
                                            : 'bg-emerald-500' // Green badge for successful steps
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }
                            />
                        }
                    >
                        <div className="font-bold capitalize text-sm text-gray-900 dark:text-gray-100">
                            {act.name}
                        </div>
                        {act.date && (
                            <div className="text-xs text-gray-500 mt-0.5">
                                {dayjs(act.date).format('DD/MM/YYYY HH:mm')}
                            </div>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    )

    // ==============
    /*
    const operationalFlow = [
        'pending',
        'accepted',
        'preparing',
        'ready_for_pickup',
        'completed',
    ]
    const currentIndex = statusFlow.indexOf(status)
    const isTerminated =
        status === 'canceled' || status === 'rejected' || status === 'no_show'

    const displayFlow = isTerminated ? ['pending', status] : operationalFlow
    const activities = displayFlow.map((step, idx) => ({
        name: step.replace(/_/g, ' '),
        completed: idx <= currentIndex,
        date: idx === 0 ? createdAt : null,
    }))

    console.log('Activities: ', activities)

    return (
        <Card>
            <h4 className="mb-4">Order Timeline</h4>
            <Timeline>
                {activities.map((act) => (
                    <Timeline.Item
                        key={act.name}
                        media={
                            <Badge
                                innerClass={
                                    isTerminated
                                        ? 'bg-red-500'
                                        : act.completed
                                          ? 'bg-emerald-500'
                                          : 'bg-gray-300'
                                }
                            />
                        }
                    >
                        <div className="font-bold capitalize">{act.name}</div>
                        {act.date && (
                            <div className="text-sm text-gray-500">
                                {dayjs(act.date).format('DD/MM/YYYY HH:mm')}
                            </div>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    )
        */
}

export default OrderDetailsActivities
