import dayjs from 'dayjs'
import {
    TbCalendar,
    TbChevronRight,
    TbEdit,
    TbPhotoOff,
    TbRestore,
    TbTrash,
    TbLockOff,
    TbLockOpen,
} from 'react-icons/tb'
import type { Cuisine } from '@/views/cuisines/types/cuisine.type'
import { useCuisineStore } from '@/store/cuisineStore'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { isCuisineDeleted } from '../hooks/useCuisineListActions'

interface CuisineListCardsProps {
    data: Cuisine[]
    total: number
    loading: boolean
    onView: (cuisine: Cuisine) => void
    onEdit: (cuisine: Cuisine) => void
    onDeactivate: (cuisine: Cuisine) => void
    onRestore: (cuisine: Cuisine) => void
    isCuisineBusy: (cuisine: Cuisine | null | undefined) => boolean
}

const CuisineListCards = ({
    data,
    total,
    loading,
    onView,
    onEdit,
    onDeactivate,
    onRestore,
    isCuisineBusy,
}: CuisineListCardsProps) => {
    const tableData = useCuisineStore((state) => state.tableData)
    const setTableData = useCuisineStore((state) => state.setTableData)

    if (loading) {
        return <CardSkeleton count={6} />
    }

    if (data.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                No cuisines found.
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.map((cuisine: any) => {
                    const deleted = isCuisineDeleted(cuisine)
                    const deletedAt = cuisine.deletedAt ?? cuisine.deleted_at
                    const isBusy = isCuisineBusy(cuisine)
                    return (
                        <div
                            key={cuisine.id}
                            className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 ${deleted ? 'border-red-200 opacity-75 dark:border-red-900/40' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="relative block h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {cuisine.image?.url ? (
                                    <img
                                        src={cuisine.image.url}
                                        alt={cuisine.name}
                                        className={`h-full w-full object-cover ${deleted ? 'opacity-60 grayscale-[0.25]' : ''}`}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <TbPhotoOff className="text-3xl text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                                <div className="absolute right-2 top-2">
                                    {deleted ? (
                                        <Tooltip
                                            title={
                                                deletedAt
                                                    ? `Deactivated on ${dayjs(deletedAt).format('DD MMM YYYY HH:mm')}`
                                                    : 'Deactivated'
                                            }
                                        >
                                            <Tag className="bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 gap-1">
                                                <TbLockOff /> Deactivated
                                            </Tag>
                                        </Tooltip>
                                    ) : (
                                        <Tag className="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 gap-1">
                                            <TbLockOpen /> Active
                                        </Tag>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-5 pt-4">
                                <h5
                                    className={`line-clamp-2 min-h-12 text-base font-bold ${deleted ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                                >
                                    {cuisine.name}
                                </h5>

                                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {cuisine.description || ''}
                                </p>

                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Created:
                                    </span>{' '}
                                    {dayjs(cuisine.created_at).format(
                                        'DD/MM/YYYY',
                                    )}
                                </div>

                                <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {!deleted && (
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                icon={<TbEdit />}
                                                className="flex-1 justify-center min-w-0 sm:flex-none"
                                                onClick={() => onEdit(cuisine)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {!deleted ? (
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                icon={<TbTrash />}
                                                className="flex-1 justify-center min-w-0 text-red-500 hover:text-red-700 sm:flex-none"
                                                disabled={isBusy}
                                                onClick={() =>
                                                    onDeactivate(cuisine)
                                                }
                                            >
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="plain"
                                                icon={<TbRestore />}
                                                className="flex-1 justify-center min-w-0 text-emerald-600 hover:text-emerald-700 sm:flex-none"
                                                disabled={isBusy}
                                                onClick={() =>
                                                    onRestore(cuisine)
                                                }
                                            >
                                                Restore
                                            </Button>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="plain"
                                        icon={<TbChevronRight />}
                                        className="w-full justify-center sm:w-auto sm:justify-start"
                                        onClick={() => onView(cuisine)}
                                    >
                                        View details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={total}
                    onChange={(page) =>
                        setTableData((prev) => ({
                            ...prev,
                            pageIndex: page,
                        }))
                    }
                />
            </div>
        </div>
    )
}

export default CuisineListCards
