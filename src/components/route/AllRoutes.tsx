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
import OwnerDashBoard from '@/views/owner/Views/Dashboard/Dashboard'
import RestaurantDetailsContent from '@/views/owner/Views/Dashboard/components/RestaurantDetailsContent'
// import EditRestaurant from '@/views/owner/Views/EditRestaurant/EditRestaurant'
// import CreateRestaurant from '@/views/owner/Views/CreateRestaurant/CreateRestaurant'
import RestaurantProfilePage from '@/views/owner/Views/RestaurantProfile/RestaurantProfile'
import CreateRestaurantProfile from '@/views/owner/Views/RestaurantProfile/CreateRestaurantProfile'
import EditRestaurantProfile from '@/views/owner/Views/RestaurantProfile/EditRestaurantProfile'
import CreateRestaurant from '@/views/owner/Views/Restaurants/CreateResturant'
import EditRestaurant from '@/views/owner/Views/Restaurants/EditRestaurantPage'

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
            <Route path="/owner/dashboard" element={<OwnerDashBoard />} />
            {/* <Route
                path="/restaurants/:id"
                element={<RestaurantDetailsContent />}
            /> */}
            <Route
                path="/restaurant/update-restaurant/:restaurantId"
                element={<EditRestaurant />}
            />
            <Route path="/restaurant/create" element={<CreateRestaurant />} />
            <Route
                path="/restaurant/profile/:restaurantId"
                element={<RestaurantProfilePage />}
            />
            <Route
                path="/restaurant/profile/edit/:profileId"
                element={<EditRestaurantProfile />}
            />
            <Route
                path="/restaurant/profile/create/:restaurantId"
                element={<CreateRestaurantProfile />}
            />
        </Routes>
    )
}

export default AllRoutes
