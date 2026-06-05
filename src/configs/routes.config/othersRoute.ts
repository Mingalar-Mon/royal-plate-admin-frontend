import { lazy } from 'react'
import { ADMIN, USER, OWNER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const othersRoute: Routes = [
    {
        key: 'accessDenied',
        path: `/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [ADMIN, USER, OWNER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
]

export default othersRoute
