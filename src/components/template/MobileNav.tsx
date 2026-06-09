import { useState, Suspense, lazy, useMemo } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import NavToggle from '@/components/shared/NavToggle'
import { DIR_RTL } from '@/constants/theme.constant'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { useThemeStore } from '@/store/themeStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { ADMIN } from '@/constants/roles.constant'

const VerticalMenuContent = lazy(
    () => import('@/components/template/VerticalMenuContent'),
)

type MobileNavToggleProps = {
    toggled?: boolean
}

type MobileNavProps = {
    translationSetup?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const MobileNav = ({
    translationSetup = appConfig.activeNavTranslation,
}: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    const handleDrawerClose = () => {
        setIsOpen(false)
    }

    const direction = useThemeStore((state) => state.direction)
    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    // 1. GET THE CURRENT SELECTION CONTEXT
    const activeRestaurantId = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )

    // console.log('active id: ', activeRestaurantId)

    const { restaurantId } = useParams()
    const currentId = activeRestaurantId || restaurantId
    console.log('Current id: ', currentId)
    // const otherIds = orderId || reservationId || dishId
    // console.log('useParams: ', useParams())
    // console.log('Other id: ', otherIds)

    // 2. Build the live dynamic navigation tree
    const dynamicNavigationTree = useMemo(() => {
        if (!currentId) {
            return navigationConfig.filter((node) => node.key === 'dashboard')
        }

        // Deep clone the static source so configuration reference properties remain immutable
        const treeCopy = cloneDeep(navigationConfig)

        // Recursion helper block to walk down subMenu nodes and replace tokens
        const substituteTokens = (nodes: any[]) => {
            nodes.forEach((node) => {
                if (node.path && node.path.includes(':restaurantId')) {
                    node.path = node.path.replace(':restaurantId', currentId)
                }

                if (node.subMenu && node.subMenu.length > 0) {
                    substituteTokens(node.subMenu)
                }
            })
        }

        substituteTokens(treeCopy)

        return treeCopy
    }, [currentId])

    return (
        <>
            <div className="text-2xl" onClick={handleOpenDrawer}>
                <MobileNavToggle toggled={isOpen} />
            </div>
            <Drawer
                title="Navigation"
                isOpen={isOpen}
                bodyClass={classNames('p-0')}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <Suspense fallback={<></>}>
                    {isOpen && (
                        <VerticalMenuContent
                            collapsed={false}
                            navigationTree={
                                userAuthority && userAuthority[0] === ADMIN
                                    ? navigationConfig
                                    : dynamicNavigationTree
                            }
                            routeKey={currentRouteKey}
                            userAuthority={userAuthority as string[]}
                            direction={direction}
                            translationSetup={translationSetup}
                            onMenuItemClick={handleDrawerClose}
                        />
                    )}
                </Suspense>
            </Drawer>
        </>
    )
}

export default MobileNav
