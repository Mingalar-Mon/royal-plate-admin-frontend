import classNames from '@/utils/classNames'
import { PiBellDuotone } from 'react-icons/pi'

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={classNames('relative flex items-center justify-center', className)}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-primary-subtle dark:hover:bg-primary-subtle transition-all duration-200 cursor-pointer">
                <PiBellDuotone className="text-2xl text-primary dark:text-primary-mild" />
                {dot && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-100" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 ring-2 ring-white dark:ring-gray-900" />
                    </span>
                )}
            </div>
        </div>
    )
}

export default NotificationToggle
