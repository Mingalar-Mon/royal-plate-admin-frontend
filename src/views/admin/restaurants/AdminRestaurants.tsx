import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { useSessionUser } from '@/store/authStore'
import { ADMIN, SUPER_ADMIN } from '@/constants/roles.constant'
import { useGetRestaurantOptions } from '@/utils/custom-hooks/useRestaurant'
import type { Restaurant } from '@/@types/restaurant'
import { TbSearch, TbTrash, TbRefresh } from 'react-icons/tb'
import DeleteRestaurantConfirmDialog, {
    type DeleteRestaurantTarget,
} from './components/DeleteRestaurantConfirmDialog'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? Math.trunc(n).toLocaleString() : '0'
}

const AdminRestaurants = () => {
    const { data, isLoading, refetch, isFetching } = useGetRestaurantOptions()
    const [search, setSearch] = useState('')
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [deleteTarget, setDeleteTarget] =
        useState<DeleteRestaurantTarget | null>(null)

    // Show the delete trigger to both admin roles. This app's admin login uses
    // `ADMIN` (see AuthProvider), while the backend guard expects `SUPER_ADMIN`,
    // so accept either — matching how the route guard treats them as one.
    const authority = useSessionUser((state) => state.user.authority) || []
    const canDelete = authority.some((role) => {
        const value = String(role).toUpperCase()
        return value === ADMIN || value === SUPER_ADMIN
    })

    const restaurants = data?.data ?? []

    const filteredRestaurants = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return restaurants
        return restaurants.filter((restaurant) =>
            [
                restaurant.name,
                restaurant.address,
                restaurant.owner?.name,
                restaurant.owner?.email,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term)),
        )
    }, [restaurants, search])

    // DataTable uses manual pagination, so it only renders the slice we pass
    // it. Keep pageIndex valid when the filtered set shrinks (e.g. a delete).
    useEffect(() => {
        const lastPage = Math.max(
            1,
            Math.ceil(filteredRestaurants.length / pageSize),
        )
        if (pageIndex > lastPage) setPageIndex(lastPage)
    }, [filteredRestaurants.length, pageSize, pageIndex])

    const pagedRestaurants = useMemo(
        () =>
            filteredRestaurants.slice(
                (pageIndex - 1) * pageSize,
                pageIndex * pageSize,
            ),
        [filteredRestaurants, pageIndex, pageSize],
    )

    const columns: ColumnDef<Restaurant>[] = useMemo(
        () => [
            {
                header: 'Restaurant',
                accessorKey: 'name',
                cell: (props) => {
                    const restaurant = props.row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                shape="circle"
                                size={40}
                                src={restaurant.logoImage?.url}
                            />
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {restaurant.name || 'Unnamed restaurant'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {restaurant.owner?.email || '—'}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Address',
                accessorKey: 'address',
                cell: (props) =>
                    props.row.original.address || (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: 'Owner',
                id: 'owner',
                cell: (props) => {
                    const owner = props.row.original.owner
                    if (!owner) return <span className="text-gray-400">—</span>
                    return (
                        <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                {owner.name || '—'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {owner.email || ''}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Price range',
                id: 'priceRange',
                cell: (props) => {
                    const restaurant = props.row.original
                    return (
                        <span className="whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                            {formatNumber(restaurant.startingPrice)} –{' '}
                            {formatNumber(restaurant.endingPrice)} MMK
                        </span>
                    )
                },
            },
            {
                header: 'Tax',
                id: 'tax',
                cell: (props) => {
                    const tax = props.row.original.tax
                    return tax == null ? (
                        <span className="text-gray-400">—</span>
                    ) : (
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                            {Number(tax)}%
                        </span>
                    )
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => {
                    const restaurant = props.row.original
                    if (!canDelete) return null
                    const isTarget = deleteTarget?.id === restaurant.id
                    return (
                        <Tooltip title="Permanently delete restaurant">
                            <div
                                className={`cursor-pointer text-xl ${
                                    isTarget
                                        ? 'opacity-50 pointer-events-none'
                                        : 'text-red-500 hover:text-red-700 dark:text-red-400'
                                }`}
                                onClick={() =>
                                    setDeleteTarget({
                                        id: restaurant.id,
                                        name: restaurant.name,
                                    })
                                }
                            >
                                <TbTrash />
                            </div>
                        </Tooltip>
                    )
                },
            },
        ],
        [canDelete, deleteTarget],
    )

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-primary text-xl font-bold">
                                Restaurants
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                All restaurants on the platform. Super admins
                                can permanently delete a restaurant and all of
                                its data.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="default"
                            icon={<TbRefresh className="h-4 w-4" />}
                            loading={isFetching && !isLoading}
                            onClick={() => refetch()}
                        >
                            Refresh
                        </Button>
                    </div>

                    <Input
                        prefix={<TbSearch />}
                        placeholder="Search by restaurant, address or owner..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPageIndex(1)
                        }}
                    />

                    {isLoading ? (
                        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 px-5 text-center dark:border-gray-700">
                            <Spinner size={40} />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Loading restaurants...
                            </span>
                        </div>
                    ) : (
                        <>
                            <DataTable
                                instanceId="admin-restaurants"
                                columns={columns}
                                data={pagedRestaurants}
                                // `isFetching` (not `isLoading`) so the table
                                // also shows its cover spinner on refetches.
                                loading={isFetching}
                                pageSizes={[10, 25, 50, 100]}
                                pagingData={{
                                    total: filteredRestaurants.length,
                                    pageIndex,
                                    pageSize,
                                }}
                                onPaginationChange={(page) =>
                                    setPageIndex(page)
                                }
                                onSelectChange={(size) => {
                                    setPageSize(size)
                                    setPageIndex(1)
                                }}
                            />

                            {filteredRestaurants.length === 0 && (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    {search
                                        ? 'No restaurants match your search.'
                                        : 'No restaurants found.'}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </AdaptiveCard>

            <DeleteRestaurantConfirmDialog
                restaurant={deleteTarget}
                onClose={() => setDeleteTarget(null)}
            />
        </Container>
    )
}

export default AdminRestaurants
