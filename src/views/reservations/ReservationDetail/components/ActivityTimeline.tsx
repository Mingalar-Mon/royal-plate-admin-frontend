import Card from '@/components/ui/Card'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import { TbCheck, TbClock, TbX } from 'react-icons/tb'
import dayjs from 'dayjs'

interface ActivityTimelineProps {
    createdAt: string
    updatedAt: string
    status: string
    confirmedAt?: string | null
    seatedAt?: string | null
    completedAt?: string | null
    terminatedAt?: string | null
}

const formatDateTime = (date: string | null | undefined) => {
    if (!date) return null
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const ActivityTimeline = ({
    createdAt,
    status,
    confirmedAt,
    seatedAt,
    completedAt,
    terminatedAt,
}: ActivityTimelineProps) => {
    const activities = [
        {
            label: 'Reservation Created',
            time: createdAt,
            completed: true,
            icon: <Badge innerClass="bg-emerald-500" />,
        },
        {
            label: 'Confirmed',
            time: confirmedAt,
            completed: !!confirmedAt,
            icon: confirmedAt ? (
                <Badge innerClass="bg-emerald-500" />
            ) : (
                <Badge innerClass="bg-gray-300 dark:bg-gray-600" />
            ),
        },
        {
            label: 'Seated',
            time: seatedAt,
            completed: !!seatedAt,
            icon: seatedAt ? (
                <Badge innerClass="bg-emerald-500" />
            ) : (
                <Badge innerClass="bg-gray-300 dark:bg-gray-600" />
            ),
        },
        {
            label: 'Completed',
            time: completedAt,
            completed: !!completedAt,
            icon: completedAt ? (
                <Badge innerClass="bg-emerald-500" />
            ) : (
                <Badge innerClass="bg-gray-300 dark:bg-gray-600" />
            ),
        },
    ]

    if (terminatedAt) {
        activities.push({
            label: 'Terminated',
            time: terminatedAt,
            completed: true,
            icon: <Badge innerClass="bg-red-500" />,
        })
    }

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbClock className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Activity Timeline
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <Timeline>
                {activities.map((act, idx) => (
                    <Timeline.Item key={idx} media={act.icon}>
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${act.completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                                {act.label}
                            </span>
                            {act.completed && (
                                <TbCheck className="text-emerald-500 text-sm" />
                            )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {act.time ? formatDateTime(act.time) : 'Pending'}
                        </div>
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
                            : status === 'cancelled' || status === 'terminated'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                        {status}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default ActivityTimeline
