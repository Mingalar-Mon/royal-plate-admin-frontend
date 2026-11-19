import classNames from '@/utils/classNames'
import { PiBellDuotone } from 'react-icons/pi'

const NotificationToggle = ({
    className,
    dot,
    count,
}: {
    className?: string
    dot: boolean
    count?: number
}) => {
    const showCount = typeof count === 'number' && count > 0

    return (
        <div
            className={classNames(
                'relative flex items-center justify-center',
                className,
            )}
        >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-primary-subtle dark:hover:bg-primary-subtle transition-all duration-200 cursor-pointer">
                <PiBellDuotone className="text-2xl text-primary dark:text-primary-mild" />
                {showCount ? (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
                        {count && count > 9 ? '9+' : count}
                    </span>
                ) : (
                    dot && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-100" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 ring-2 ring-white dark:ring-gray-900" />
                        </span>
                    )
                )}
            </div>
        </div>
    )
}

export default NotificationToggle
