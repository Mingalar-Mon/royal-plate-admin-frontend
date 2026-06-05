// components/OrderDetailsActivities.tsx
import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import dayjs from 'dayjs'

const statusFlow = [
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'completed',
]
interface OrderDetailsActivitiesProps {
    status: string
    createdAt: string
}

const OrderDetailsActivities = ({
    status,
    createdAt,
}: OrderDetailsActivitiesProps) => {
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
}

export default OrderDetailsActivities
