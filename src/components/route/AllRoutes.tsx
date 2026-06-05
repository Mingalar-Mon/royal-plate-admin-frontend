import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import FallbackRoute from './FallbackRoute'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { Routes, Route, Navigate } from 'react-router'
import type { LayoutType } from '@/@types/theme'
import Login from '@/views/owner/Login/Login'

{
    /*
import OwnerDashBoard from '@/views/owner/Views/Dashboard/Dashboard'
import RestaurantProfilePage from '@/views/owner/Views/RestaurantProfile/RestaurantProfile'
import CreateRestaurantProfile from '@/views/owner/Views/RestaurantProfile/CreateRestaurantProfile'
import EditRestaurantProfile from '@/views/owner/Views/RestaurantProfile/EditRestaurantProfile'

import OrderCreate from '@/views/order/OrderCreate'
import OrderList from '@/views/order/OrderList/OrderListPage'

import OrderDetails from '@/views/order/OrderDetails'
import DishList from '@/views/dishes/DishList/DishList'
import DishCreate from '@/views/dishes/DishCreate'
import DishDetail from '@/views/dishes/DishDetail'
import DishEdit from '@/views/dishes/DishEdit'
import ReservationList from '@/views/reservations/ReservationList/ReservationList'
import ReservationDetail from '@/views/reservations/ReservationDetail'
import StaffDetail from '@/views/staff/StaffDetail/StaffDetail'
import StaffEdit from '@/views/staff/StaffEdit/StaffEdit'
import StaffCreate from '@/views/staff/StaffCreate/StaffCreate'
import StaffList from '@/views/staff/StaffList/StaffList'

import BlogList from '@/views/blogs/BlogList'
import BlogCreate from '@/views/blogs/BlogCreate'
import BlogEdit from '@/views/blogs/BlogEdit'
import BlogDetail from '@/views/blogs/BlogDetail'

import CuisineList from '@/views/cuisines/CuisineList'
import CuisineCreate from '@/views/cuisines/CuisineCreate'
import CuisineEdit from '@/views/cuisines/CuisineEdit'
import CuisineDetail from '@/views/cuisines/CuisineDetail'
import TableList from '@/views/tables/TableList'
import TableCreate from '@/views/tables/TableCreate'
import TableEdit from '@/views/tables/TableEdit'
import TableDetail from '@/views/tables/TableDetail'
import BannerList from '@/views/banners/BannerList'
import BannerCreate from '@/views/banners/BannerCreate'
import BannerEdit from '@/views/banners/BannerEdit'
import BannerDetail from '@/views/banners/BannerDetail'
import UserList from '@/views/users/UserList/UserList'
import UserDetail from '@/views/users/UserDetail/UserDetail'
import OwnerList from '@/views/owner/OwnerList'
import OwnerDetail from '@/views/owner/OwnerDetail'

// -======== DONE ===========
// import CreateRestaurant from '@/views/owner/Views/Restaurants/CreateResturant'
// import EditRestaurant from '@/views/owner/Views/Restaurants/EditRestaurantPage'
// import RestaurantDetailsContent from '@/views/owner/Views/Dashboard/components/RestaurantDetailsContent'
// import EditRestaurant from '@/views/owner/Views/EditRestaurant/EditRestaurant'
// import CreateRestaurant from '@/views/owner/Views/CreateRestaurant/CreateRestaurant'

 */
}

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/" element={<PublicRoute />}>
                <Route index element={<FallbackRoute />} />
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    index
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>

            <Route path="/owner/login" element={<Login />} />
            {/* <Route path="/owner/dashboard" element={<OwnerDashBoard />} /> */}
            {/* <Route
                path="/restaurants/:id"
                element={<RestaurantDetailsContent />}
            /> */}
            {/* <Route
                path="/restaurant/update-restaurant/:restaurantId"
                element={<EditRestaurant />}
            /> */}
            {/* <Route path="/restaurant/create" element={<CreateRestaurant />} /> */}
            {/* <Route
                path="/restaurant/profile/:restaurantId"
                element={<RestaurantProfilePage />}
            /> */}
            {/* <Route
                path="/restaurant/profile/edit/:profileId"
                element={<EditRestaurantProfile />}
            /> */}
            {/* <Route
                path="/restaurant/profile/create/:restaurantId"
                element={<CreateRestaurantProfile />}
            /> */}

            {/* <Route
                path="restaurants/:restaurantId/orders"
                element={<OrderList />}
            /> */}
            {/* <Route
                path="restaurants/:restaurantId/orders/create"
                element={<OrderCreate />}
            /> */}
            {/* <Route path="orders/:orderId" element={<OrderDetails />} /> */}

            {/* <Route
                path="/restaurants/:restaurantId/dishes"
                element={<DishList />}
            /> */}

            {/* <Route
                path="dishes/create/:restaurantId"
                element={<DishCreate />}
            /> */}
            {/* <Route path="dishes/edit/:dishId" element={<DishEdit />} /> */}
            {/* <Route path="dishes/detail/:dishId" element={<DishDetail />} /> */}
            {/* <Route
                path="reservations/:restaurantId/reservations"
                element={<ReservationList />}
            />
            <Route
                path="reservations/details/:reservationId"
                element={<ReservationDetail />}
            /> */}
            {/* <Route
                path="restaurants/:restaurantId/staffs"
                element={<StaffList />}
            />
            <Route
                path="restaurants/:restaurantId/staff/create"
                element={<StaffCreate />}
            />
            <Route
                path="restaurants/:restaurantId/staff/edit/:staffId"
                element={<StaffEdit />}
            />
            <Route
                path="restaurants/:restaurantId/staff/:staffId"
                element={<StaffDetail />}
            /> */}

            {/* 
            <Route
                path="restaurants/:restaurantId/blogs"
                element={<BlogList />}
            />
            <Route
                path="restaurants/:restaurantId/blogs/create"
                element={<BlogCreate />}
            />
            <Route
                path="restaurants/:restaurantId/blogs/edit/:blogId"
                element={<BlogEdit />}
            />
            <Route
                path="restaurants/:restaurantId/blogs/:blogId"
                element={<BlogDetail />}
            />

            <Route path="cuisines" element={<CuisineList />} />
            <Route path="cuisines/edit/:id" element={<CuisineEdit />} />
            <Route path="cuisines/create" element={<CuisineCreate />} />
            <Route path="cuisines/:id" element={<CuisineDetail />} />

            <Route
                path="restaurants/:restaurantId/tables"
                element={<TableList />}
            />
            <Route
                path="restaurants/:restaurantId/tables/create"
                element={<TableCreate />}
            />
            <Route
                path="restaurants/:restaurantId/tables/edit/:id"
                element={<TableEdit />}
            />
            <Route
                path="restaurants/:restaurantId/tables/:id"
                element={<TableDetail />}
            />

            <Route path="banners" element={<BannerList />} />
            <Route path="banners/create" element={<BannerCreate />} />
            <Route path="banners/edit/:id" element={<BannerEdit />} />
            <Route path="banners/:id" element={<BannerDetail />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/owners" element={<OwnerList />} />
            <Route path="/owners/:id" element={<OwnerDetail />} />
            */}
        </Routes>
    )
}

export default AllRoutes
