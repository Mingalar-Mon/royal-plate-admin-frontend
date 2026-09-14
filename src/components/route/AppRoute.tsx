import { useEffect, useCallback } from 'react'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useLocation } from 'react-router'
import { useThemeStore } from '@/store/themeStore'
import type { LayoutType } from '@/@types/theme'
import type { ComponentType } from 'react'
import type { NavigationTree } from '@/@types/navigation'

export type AppRouteProps<T> = {
    component: ComponentType<T>
    routeKey: string
    layout?: LayoutType
    navigationTree?: NavigationTree[]
}

const AppRoute = <T extends Record<string, unknown>>({
    component: Component,
    routeKey,
    navigationTree,
    ...props
}: AppRouteProps<T>) => {
    const location = useLocation()

    const { layout, setPreviousLayout, setLayout } = useThemeStore(
        (state) => state,
    )

    const { type: layoutType, previousType: previousLayout } = layout

    const setCurrentRouteKey = useRouteKeyStore(
        (state) => state.setCurrentRouteKey,
    )

    const handleLayoutChange = useCallback(() => {
        setCurrentRouteKey(routeKey)

        // Only normalize URL for routes that exist in the navigation tree.
        // Avoid rewriting auth/public pages where path mapping is fragile.
        if (navigationTree && navigationTree.length > 0) {
            const node =
                navigationTree
                    .flatMap((n) => [n, ...(n.subMenu ?? [])])
                    .find((n) => n.key === routeKey) ??
                navigationTree
                    .flatMap((n) => [n, ...(n.subMenu ?? [])])
                    .find((n) => n.path === routeKey)

            if (node?.path && node.path !== '/') {
                window.history.replaceState(null, '', node.path)
            }
        }

        if (props.layout && props.layout !== layoutType) {
            setPreviousLayout(layoutType)
            setLayout(props.layout)
        }

        if (!props.layout && previousLayout && layoutType !== previousLayout) {
            setLayout(previousLayout)
            setPreviousLayout('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.layout, routeKey])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    return <Component {...(props as T)} />
}

export default AppRoute
