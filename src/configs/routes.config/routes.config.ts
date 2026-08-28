import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import { ADMIN, OWNER, STAFF } from '@/constants/roles.constant'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'owner.dashboard',
        path: '/owner/dashboard',
        component: lazy(
            () => import('@/views/owner/Views/Dashboard/Dashboard'),
        ),
        authority: [OWNER], // owner
    },

    // ================ RESTAURANT ========================
    {
        key: 'restaurant.profile',
        path: '/restaurant/restaurant-profile/:restaurantId',
        component: lazy(
            () =>
                import('@/views/owner/Views/RestaurantProfile/RestaurantProfile'),
        ),
        authority: [OWNER],
    },
    {
        key: 'restaurant.edit-profile',
        path: '/restaurant/update-restaurant/:restaurantId',
        component: lazy(
            () => import('@/views/owner/Views/Restaurants/EditRestaurantPage'),
        ),
        authority: [OWNER], // owner
    },
    {
        key: 'restaurant.create-restaurant',
        path: '/restaurant/create-restaurant',
        component: lazy(
            () => import('@/views/owner/Views/Restaurants/CreateResturant'),
        ),
        authority: [OWNER],
    },
    {
        key: 'restaurant.edit-profile',
        path: '/restaurant/update-restaurant-profile/:restaurantId/:profileId',
        component: lazy(
            () =>
                import('@/views/owner/Views/RestaurantProfile/EditRestaurantProfile'),
        ),
        authority: [OWNER],
    },
    {
        key: 'restaurant.create-profile',
        path: '/restaurant/create-restaurant-profile/:restaurantId',
        component: lazy(
            () =>
                import('@/views/owner/Views/RestaurantProfile/CreateRestaurantProfile'),
        ),
        authority: [OWNER],
    },
    {
        key: 'restaurant.eda-dashboard',
        path: '/restaurants/:restaurantId/eda-dashboard',
        component: lazy(
            () =>
                import('@/views/owner/Views/Dashboard/components/EdaDashboard'),
        ),
        authority: [OWNER],
    },
    {
        key: 'restaurant.profile',
        path: '/restaurant/restaurant-profile/:profileId',
        component: lazy(
            () =>
                import('@/views/owner/Views/RestaurantProfile/RestaurantProfile'),
        ),
        authority: [OWNER],
    },

    // ================== ORDER ==================
    {
        key: 'order.list',
        path: '/restaurants/:restaurantId/orders',
        component: lazy(() => import('@/views/order/OrderList')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'order.create',
        path: '/restaurants/:restaurantId/orders/create',
        component: lazy(() => import('@/views/order/OrderCreate')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'order.detail',
        path: '/orders/:orderId',
        component: lazy(() => import('@/views/order/OrderDetails')),
        authority: [OWNER, STAFF],
    },

    // ================= DISH ==================
    {
        key: 'dish.create',
        path: '/dishes/create/:restaurantId',
        component: lazy(() => import('@/views/dishes/DishCreate')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'dish.edit',
        path: '/dishes/edit/:dishId',
        component: lazy(() => import('@/views/dishes/DishEdit')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'dish.detail',
        path: '/dishes/detail/:dishId',
        component: lazy(() => import('@/views/dishes/DishDetail')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'dish.list',
        path: '/restaurants/:restaurantId/dishes',
        component: lazy(() => import('@/views/dishes/DishList')),
        authority: [OWNER, STAFF],
    },
    // ============ RESERVATION =============
    {
        key: 'reservation.detail',
        path: '/reservations/detail/:reservationId',
        component: lazy(() => import('@/views/reservations/ReservationDetail')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'reservation.list',
        path: '/restaurants/:restaurantId/reservations',
        component: lazy(() => import('@/views/reservations/ReservationList')),
        authority: [OWNER, STAFF],
    },
    // ================ STAFF ==============
    {
        key: 'staff.create',
        path: '/restaurants/:restaurantId/staff/create',
        component: lazy(() => import('@/views/staff/StaffCreate')),
        authority: [OWNER],
    },
    {
        key: 'staff.edit',
        path: '/restaurants/:restaurantId/staff/edit/:staffId',
        component: lazy(() => import('@/views/staff/StaffEdit')),
        authority: [OWNER],
    },
    {
        key: 'staff.detail',
        path: '/restaurants/:restaurantId/staff/detail/:staffId',
        component: lazy(() => import('@/views/staff/StaffDetail')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'staff.list',
        path: '/restaurants/:restaurantId/staffs',
        component: lazy(() => import('@/views/staff/StaffList')),
        authority: [OWNER],
    },
    // ============= TABLE ================
    {
        key: 'table.list',
        path: '/restaurants/:restaurantId/tables',
        component: lazy(() => import('@/views/tables/TableList')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'table.detail',
        path: '/restaurants/:restaurantId/tables/:id',
        component: lazy(() => import('@/views/tables/TableDetail')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'table.create',
        path: '/restaurants/:restaurantId/tables/create',
        component: lazy(() => import('@/views/tables/TableCreate')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'table.edit',
        path: '/restaurants/:restaurantId/tables/edit/:id',
        component: lazy(() => import('@/views/tables/TableEdit')),
        authority: [OWNER, STAFF],
    },

    // ============= ADMIN DASHBOARD ===========

    // cuisine
    {
        key: 'cuisine.create',
        path: '/cuisines/create',
        component: lazy(() => import('@/views/cuisines/CuisineCreate')),
        authority: [ADMIN],
    },
    {
        key: 'cuisine.detail',
        path: '/cuisines/:id',
        component: lazy(() => import('@/views/cuisines/CuisineDetail')),
        authority: [ADMIN],
    },
    {
        key: 'cuisine.edit',
        path: '/cuisines/edit/:id',
        component: lazy(() => import('@/views/cuisines/CuisineEdit')),
        authority: [ADMIN],
    },
    {
        key: 'cuisine.list',
        path: '/cuisines',
        component: lazy(() => import('@/views/cuisines/CuisineList')),
        authority: [ADMIN],
    },
    // blog
    {
        key: 'blog.list',
        path: '/restaurants/:restaurantId/blogs',
        component: lazy(() => import('@/views/blogs/BlogList')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'blog.create',
        path: '/restaurants/:restaurantId/blogs/create',
        component: lazy(() => import('@/views/blogs/BlogCreate')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'blog.edit',
        path: '/restaurants/:restaurantId/blogs/edit/:blogId',
        component: lazy(() => import('@/views/blogs/BlogEdit')),
        authority: [OWNER, STAFF],
    },
    {
        key: 'blog.detail',
        path: '/restaurants/:restaurantId/blogs/:blogId',
        component: lazy(() => import('@/views/blogs/BlogDetail')),
        authority: [OWNER, STAFF],
    },

    // Banner
    {
        key: 'banner.list',
        path: '/banners',
        component: lazy(() => import('@/views/banners/BannerList')),
        authority: [ADMIN],
    },
    {
        key: 'banner.create',
        path: '/banners/create',
        component: lazy(() => import('@/views/banners/BannerCreate')),
        authority: [ADMIN],
    },
    {
        key: 'banner.edit',
        path: '/banners/edit/:id',
        component: lazy(() => import('@/views/banners/BannerEdit')),
        authority: [ADMIN],
    },
    {
        key: 'banner.detail',
        path: '/banners/:id',
        component: lazy(() => import('@/views/banners/BannerDetail')),
        authority: [ADMIN],
    },

    // App Version
    {
        key: 'appVersion.list',
        path: '/app-versions',
        component: lazy(() => import('@/views/app-versions/AppVersionList')),
        authority: [ADMIN],
    },
    {
        key: 'appVersion.create',
        path: '/app-versions/create',
        component: lazy(() => import('@/views/app-versions/AppVersionCreate')),
        authority: [ADMIN],
    },
    {
        key: 'appVersion.edit',
        path: '/app-versions/edit/:id',
        component: lazy(() => import('@/views/app-versions/AppVersionEdit')),
        authority: [ADMIN],
    },
    {
        key: 'appVersion.detail',
        path: '/app-versions/:id',
        component: lazy(() => import('@/views/app-versions/AppVersionDetail')),
        authority: [ADMIN],
    },

    // User
    {
        key: 'user.list',
        path: '/users',
        component: lazy(() => import('@/views/users/UserList')),
        authority: [ADMIN],
    },
    {
        key: 'user.detail',
        path: '/users/:id',
        component: lazy(() => import('@/views/users/UserDetail')),
        authority: [ADMIN],
    },
    {
        key: 'owner.list',
        path: '/owners',
        component: lazy(() => import('@/views/owner/OwnerList')),
        authority: [ADMIN],
    },
    {
        key: 'owner.detail',
        path: '/owners/:id',
        component: lazy(() => import('@/views/owner/OwnerDetail')),
        authority: [ADMIN],
    },
    // ========= owner page ============
    {
        key: 'owner.edit',
        path: '/owners/edit-owner/:id',
        component: lazy(() => import('@/views/owner/OwnerEdit')),
        authority: [],
    },
    {
        key: 'owner.create',
        path: '/owners/create',
        component: lazy(() => import('@/views/owner/OwnerCreate')),
        authority: [],
    },

    // ===== create account page ===========
    {
        key: 'sign.up',
        path: '/sign-up',
        component: lazy(() => import('@/views/auth/SignUp')),
        authority: [ADMIN],
    },

    //

    /** Example purpose only, please remove */
    // {
    //     key: 'singleMenuItem',
    //     path: '/single-menu-view',
    //     component: lazy(() => import('@/views/demo/SingleMenuView')),
    //     authority: [],
    // },
    // {
    //     key: 'collapseMenu.item1',
    //     path: '/collapse-menu-item-view-1',
    //     component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
    //     authority: [],
    // },
    // {
    //     key: 'collapseMenu.item2',
    //     path: '/collapse-menu-item-view-2',
    //     component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
    //     authority: [],
    // },
    // {
    //     key: 'groupMenu.single',
    //     path: '/group-single-menu-item-view',
    //     component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
    //     authority: [],
    // },
    // {
    //     key: 'groupMenu.collapse.item1',
    //     path: '/group-collapse-menu-item-view-1',
    //     component: lazy(
    //         () => import('@/views/demo/GroupCollapseMenuItemView1'),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'groupMenu.collapse.item2',
    //     path: '/group-collapse-menu-item-view-2',
    //     component: lazy(
    //         () => import('@/views/demo/GroupCollapseMenuItemView2'),
    //     ),
    //     authority: [],
    // },
    ...othersRoute,
]
