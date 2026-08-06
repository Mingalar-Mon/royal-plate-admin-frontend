import { useParams, useNavigate } from 'react-router'
import { useTableDetailQuery } from '@/utils/custom-hooks/useTable' // Production query hook
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import dayjs from 'dayjs'
import {
    TbArrowNarrowLeft,
    TbEdit,
    TbUsers,
    TbClock,
    TbCalendar,
    TbList,
} from 'react-icons/tb'

// Simple UI custom component state badges configurations fallbacks maps if needed
const TableStatusBadge = ({ status }: { status: string }) => (
    <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
            status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
        }`}
    >
        {status}
    </span>
)

const TableTypeBadge = ({ type }: { type: string }) => (
    <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">
        {type}
    </span>
)

const TableDetail = () => {
    const { id, restaurantId } = useParams()
    const navigate = useNavigate()

    // 1. Fetch live table payload metadata straight from React Query
    const { data: tableResponse, isLoading } = useTableDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    // 2. Safely unpack your server response wrapper object footprint
    const table = tableResponse?.data
    if (!table)
        return <div className="p-8 text-center">Table record not found</div>

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    {/* Header Controls Row Panels */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() =>
                                navigate(`/restaurants/${restaurantId}/tables`)
                            }
                        >
                            Back to Tables
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() =>
                                navigate(
                                    `/restaurants/${restaurantId}/tables/edit/${table.id}`,
                                )
                            }
                        >
                            Edit Table
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Main Matrix Content Split Column Box Panels */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Table #{table.id.slice(0, 8)}
                                    </h1>
                                    <TableStatusBadge status={table.status} />
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <TableTypeBadge type={table.type} />
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                        <TbUsers className="text-gray-400 text-lg" />
                                        <span>
                                            Max Capacity:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {table.capacity}
                                            </strong>{' '}
                                            Persons
                                        </span>
                                    </div>
                                    {table.durationMinutes && (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                            <TbClock className="text-gray-400 text-lg" />
                                            <span>
                                                Session Duration Time:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100">
                                                    {table.durationMinutes}
                                                </strong>{' '}
                                                Minutes
                                            </span>
                                        </div>
                                    )}
                                    {table.tableFee ? (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-gray-400 font-bold text-base select-none">
                                                🇲🇲
                                            </span>
                                            <span>
                                                Base Booking Fee:{' '}
                                                <strong className="text-gray-900 dark:text-gray-100">
                                                    MMK{' '}
                                                    {Number(
                                                        table.tableFee,
                                                    ).toLocaleString()}
                                                </strong>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-gray-400 font-bold text-base select-none">
                                                🇲🇲
                                            </span>
                                            <span>
                                                Base Booking Fee:{' '}
                                                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    Free
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Amenities and Services Arrays Chips loops */}
                            {table.services && table.services.length > 0 && (
                                <Card>
                                    <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <TbList className="text-indigo-500" />
                                        Services & Amenities Available
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {table.services.map(
                                            (service: string) => (
                                                <span
                                                    key={service}
                                                    className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md text-xs font-semibold text-gray-600 dark:text-gray-300"
                                                >
                                                    {service}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Right Sidebar Timeline System Metadata Card Info Column */}
                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                    System Records
                                </h4>
                                <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Created:{' '}
                                            {/* ✅ Injects real TypeORM snake_case created date key */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(table.created_at).format(
                                                    'DD MMM YYYY, HH:mm',
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Updated:{' '}
                                            {/* ✅ Injects real TypeORM snake_case modified date key */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(table.updated_at).format(
                                                    'DD MMM YYYY, HH:mm',
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </AdaptiveCard>
    )
}

export default TableDetail
