/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable  @typescript-eslint/no-explicit-any
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import type { NavigationTree } from '@/@types/navigation'

interface NavInfo extends NavigationTree {
    parentKey?: string
}

// Check whether a nav path (which may contain :params like :restaurantId)
// matches the current location pathname.
const isPathMatched = (
    navPath: string | undefined,
    pathname: string,
): boolean => {
    if (!navPath || navPath === '/') {
        return false
    }

    const navSegments = navPath.split('/').filter(Boolean)
    const pathSegments = pathname.split('/').filter(Boolean)

    if (navSegments.length !== pathSegments.length) {
        return false
    }

    return navSegments.every(
        (segment, index) =>
            segment.startsWith(':') || segment === pathSegments[index],
    )
}

const getRouteInfo = (
    navTree: NavInfo | NavInfo[],
    key: string,
    pathname: string,
): NavInfo | undefined => {
    if (Array.isArray(navTree)) {
        for (const node of navTree) {
            const found = getRouteInfo(node, key, pathname)
            if (found) {
                return found
            }
        }
        return undefined
    }

    // The node itself is the active route (matched by route key or by URL path)
    if (navTree.key === key || isPathMatched(navTree.path, pathname)) {
        return navTree
    }

    // Otherwise look inside its sub menu
    if (navTree.subMenu && navTree.subMenu.length > 0) {
        for (const child of navTree.subMenu) {
            const found = getRouteInfo(child, key, pathname)
            if (found) {
                found.parentKey = navTree.key
                return found
            }
        }
    }

    return undefined
}

const findNestedRoute = (navTree: NavigationTree[], key: string): boolean => {
    const found = navTree.find((node) => {
        return node.key === key
    })
    if (found) {
        return true
    }
    return navTree.some((c) => findNestedRoute(c.subMenu, key))
}

const getTopRouteKey = (
    navTree: NavigationTree[],
    key: string,
): NavigationTree => {
    let foundNav = {} as NavigationTree
    navTree.forEach((nav) => {
        if (findNestedRoute([nav], key)) {
            foundNav = nav
        }
    })
    return foundNav
}

function useMenuActive(navTree: NavigationTree[], key: string) {
    const { pathname } = useLocation()

    const activedRoute = useMemo(() => {
        const route = getRouteInfo(navTree, key, pathname)
        return route
    }, [navTree, key, pathname])

    const includedRouteTree = useMemo(() => {
        const included = getTopRouteKey(navTree, key)
        return included
    }, [navTree, key])

    return { activedRoute, includedRouteTree }
}

export default useMenuActive
