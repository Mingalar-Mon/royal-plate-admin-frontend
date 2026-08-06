import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import dayjs from 'dayjs'

const ActivityTimeline = ({
    createdAt,
    updatedAt,
    status,
}: {
    createdAt: string
    updatedAt: string
    status: string
}) => {
    const activities = [
        { label: 'Reservation created', time: createdAt, completed: true },
        { label: `Status: ${status}`, time: updatedAt, completed: true },
    ]

    return (
        <Card>
            <h4 className="mb-4">Activity</h4>
            <Timeline>
                {activities.map((act, idx) => (
                    <Timeline.Item
                        key={idx}
                        media={<Badge innerClass="bg-emerald-500" />}
                    >
                        <div className="font-bold">{act.label}</div>
                        <div className="text-sm text-gray-500">
                            {dayjs(act.time).format('DD/MM/YYYY HH:mm')}
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    )
}

export default ActivityTimeline
