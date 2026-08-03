import { useParams, useNavigate } from 'react-router'
import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import {
    TbArrowNarrowLeft,
    TbCircleCheck,
    TbClock,
    TbChecklist,
    TbCalendarClock,
    TbCalendarCheck,
} from 'react-icons/tb'
import {
    useGetDashboardEDA,
    useGetTopSaleDishes,
    useGetTopCustomers,
} from '@/utils/custom-hooks/useDashboard'
import { useRestaurantStore } from '@/store/restaurantStore'

const EdaDashboard = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const { setActiveRestaurant } = useRestaurantStore()

    const { data: edaData, isLoading: edaLoading } = useGetDashboardEDA(
        restaurantId as string,
    )
    const { data: topSaleDishes, isLoading: dishesLoading } =
        useGetTopSaleDishes(restaurantId as string)
    const { data: topCustomers, isLoading: customersLoading } =
        useGetTopCustomers(restaurantId as string)

    const loading = edaLoading || dishesLoading || customersLoading

    useEffect(() => {
        if (restaurantId) {
            setActiveRestaurant({
                id: restaurantId,
                name: restaurantId,
            })
        }
    }, [restaurantId, setActiveRestaurant])

    const handleBack = () => {
        setActiveRestaurant(null)
        navigate('/owner/dashboard')
    }

    if (!restaurantId) {
        return (
            <Container>
                <div className="py-6 text-center">
                    <p className="text-gray-500">Invalid restaurant ID</p>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <h3>EDA Dashboard</h3>
                    <Button
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={handleBack}
                    >
                        Back to Dashboard
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Spinner size={40} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="transition-all hover:shadow-md">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">
                                            Today Accepted Orders
                                        </p>
                                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                            <TbCircleCheck size={22} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold">
                                        {edaData?.data?.todayAcceptedOrders ??
                                            0}
                                    </p>
                                </div>
                            </Card>
                            <Card className="transition-all hover:shadow-md">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">
                                            Today Pending Orders
                                        </p>
                                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                            <TbClock size={22} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold">
                                        {edaData?.data?.todayPendingOrder ?? 0}
                                    </p>
                                </div>
                            </Card>
                            <Card className="transition-all hover:shadow-md">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">
                                            Today Confirmed Orders
                                        </p>
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                            <TbChecklist size={22} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold">
                                        {edaData?.data?.todayComfirmedOrder ??
                                            0}
                                    </p>
                                </div>
                            </Card>
                            <Card className="transition-all hover:shadow-md">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">
                                            Today Pending Reservations
                                        </p>
                                        <div className="p-2.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                            <TbCalendarClock size={22} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold">
                                        {edaData?.data
                                            ?.todayPendingReservation ?? 0}
                                    </p>
                                </div>
                            </Card>
                            <Card className="transition-all hover:shadow-md">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">
                                            Today Confirmed Reservations
                                        </p>
                                        <div className="p-2.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-lg">
                                            <TbCalendarCheck size={22} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold">
                                        {edaData?.data
                                            ?.todayComfirmedReservation ?? 0}
                                    </p>
                                </div>
                            </Card>
                        </div>

                        <Card>
                            <div className="p-4">
                                <h4 className="mb-4">Top Sale Dishes</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2">Dish</th>
                                                <th className="py-2">Price</th>
                                                <th className="py-2">
                                                    Total Quantity Sold
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topSaleDishes?.data?.length ===
                                                0 && (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="py-4 text-center text-gray-500"
                                                    >
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                            {topSaleDishes?.data?.map(
                                                (dish) => (
                                                    <tr
                                                        key={dish.dishId}
                                                        className="border-b"
                                                    >
                                                        <td className="py-2 flex items-center gap-2">
                                                            <img
                                                                src={
                                                                    dish.coverImageUrl
                                                                }
                                                                alt={
                                                                    dish.dishName
                                                                }
                                                                className="w-8 h-8 rounded object-cover"
                                                            />
                                                            <span>
                                                                {dish.dishName}
                                                            </span>
                                                        </td>
                                                        <td className="py-2">
                                                            {dish.price}
                                                        </td>
                                                        <td className="py-2">
                                                            {dish.totalQuantity}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-4">
                                <h4 className="mb-4">Top Customers</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="text-sm font-semibold mb-2 text-gray-700">
                                            Most Ordered Customers
                                        </h5>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="py-2">
                                                            Name
                                                        </th>
                                                        <th className="py-2">
                                                            Email
                                                        </th>
                                                        <th className="py-2">
                                                            Total Orders
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topCustomers?.data
                                                        ?.mostOrderedCustomers
                                                        ?.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className="py-4 text-center text-gray-500"
                                                            >
                                                                No data
                                                                available
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {topCustomers?.data?.mostOrderedCustomers?.map(
                                                        (customer) => (
                                                            <tr
                                                                key={
                                                                    customer.userId
                                                                }
                                                                className="border-b"
                                                            >
                                                                <td className="py-2">
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </td>
                                                                <td className="py-2">
                                                                    {
                                                                        customer.email
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center">
                                                                    {
                                                                        customer.totalorders
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold mb-2 text-gray-700">
                                            Most Reservation Customers
                                        </h5>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="py-2">
                                                            Name
                                                        </th>
                                                        <th className="py-2">
                                                            Email
                                                        </th>
                                                        <th className="py-2">
                                                            Total Reservations
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topCustomers?.data
                                                        ?.mostReservationCustomers
                                                        ?.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className="py-4 text-center text-gray-500"
                                                            >
                                                                No data
                                                                available
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {topCustomers?.data?.mostReservationCustomers?.map(
                                                        (customer) => (
                                                            <tr
                                                                key={
                                                                    customer.userId
                                                                }
                                                                className="border-b"
                                                            >
                                                                <td className="py-2">
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </td>
                                                                <td className="py-2">
                                                                    {
                                                                        customer.email
                                                                    }
                                                                </td>
                                                                <td className="py-2 text-center">
                                                                    {
                                                                        customer.totalreservations
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default EdaDashboard
