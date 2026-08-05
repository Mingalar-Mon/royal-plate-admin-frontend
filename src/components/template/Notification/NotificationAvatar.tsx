import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import useRandomBgColor from '@/utils/hooks/useRandomBgColor'
import {
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlineShoppingBag,
} from 'react-icons/hi'
import type { NotificationItem } from '@/@types/notification'

const GeneratedAvatar = ({ name }: { name: string }) => {
    const color = useRandomBgColor()
    return (
        <Avatar shape="circle" className={`text-gray-900 ${color(name)}`}>
            {acronym(name)}
        </Avatar>
    )
}

const NotificationAvatar = (props: {
    category: NotificationItem['category']
    eventType: NotificationItem['eventType']
    actorName: string | null
    actorImage: string | null
}) => {
    const { category, eventType, actorName, actorImage } = props

    if (actorImage) {
        return (
            <Avatar
                shape="circle"
                src={actorImage}
                alt={actorName ?? ''}
            />
        )
    }

    if (actorName) {
        return <GeneratedAvatar name={actorName} />
    }

    if (category === 'order') {
        if (eventType === 'cancelled') {
            return (
                <Avatar
                    shape="circle"
                    className="bg-red-200 text-gray-900"
                    icon={<HiOutlineBan />}
                />
            )
        }
        return (
            <Avatar
                shape="circle"
                className="bg-sky-200 text-gray-900"
                icon={<HiOutlineShoppingBag />}
            />
        )
    }

    if (category === 'reservation') {
        if (eventType === 'cancelled') {
            return (
                <Avatar
                    shape="circle"
                    className="bg-red-200 text-gray-900"
                    icon={<HiOutlineBan />}
                />
            )
        }
        if (eventType === 'completed' || eventType === 'confirmed') {
            return (
                <Avatar
                    shape="circle"
                    className="bg-emerald-200 text-gray-900"
                    icon={<HiOutlineClipboardCheck />}
                />
            )
        }
        return (
            <Avatar
                shape="circle"
                className="bg-amber-200 text-gray-900"
                icon={<HiOutlineCalendar />}
            />
        )
    }

    return <Avatar />
}

export default NotificationAvatar