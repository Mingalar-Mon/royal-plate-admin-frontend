import classNames from 'classnames'
import Skeleton from '@/components/ui/Skeleton'

const CardSkeleton = ({
    count = 6,
    className,
}: {
    count?: number
    className?: string
}) => (
    <div
        className={classNames(
            'grid',
            className ?? 'grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3',
        )}
    >
        {Array.from({ length: count }).map((_, index) => (
            <div
                key={index}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                        <Skeleton width={70} height={10} />
                        <Skeleton width={120} height={20} />
                    </div>
                    <Skeleton width={74} height={26} className="rounded-full" />
                </div>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton width={60} height={10} />
                        <Skeleton width={140} height={10} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton width={60} height={10} />
                        <Skeleton width={120} height={10} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton width={60} height={10} />
                        <Skeleton width={100} height={10} />
                    </div>
                </div>
                <div className="mt-4 flex-1 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <Skeleton width={90} height={10} className="mb-3" />
                    <div className="space-y-1.5">
                        <Skeleton width="80%" height={10} />
                        <Skeleton width="65%" height={10} />
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <Skeleton width={90} height={16} />
                    <Skeleton width={90} height={28} />
                </div>
            </div>
        ))}
    </div>
)

export default CardSkeleton