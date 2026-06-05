import { useMemo, useState } from 'react'
import {
    SPLITTED_SIDE_NAV_MINI_WIDTH,
    STACKED_SIDE_NAV_SECONDARY_WIDTH,
    DIR_LTR,
    DIR_RTL,
} from '@/constants/theme.constant'
import StackedSideNavMini, { SelectedMenuItem } from './StackedSideNavMini'
import StackedSideNavSecondary from './StackedSideNavSecondary'
import useResponsive from '@/utils/hooks/useResponsive'
import { useThemeStore } from '@/store/themeStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import isEmpty from 'lodash/isEmpty'
import useTranslation from '@/utils/hooks/useTranslation'
import type { TraslationFn } from '@/@types/common'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useParams } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'

const stackedSideNavDefaultStyle = {
    width: SPLITTED_SIDE_NAV_MINI_WIDTH,
}

const StackedSideNav = ({
    translationSetup = appConfig.activeNavTranslation,
}: {
    translationSetup?: boolean
}) => {
    const { t } = useTranslation(!translationSetup)

    const [selectedMenu, setSelectedMenu] = useState<SelectedMenuItem>({})
    const [activeKeys, setActiveKeys] = useState<string[]>([])

    const mode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    const { larger } = useResponsive()

    // 1. Get the current selection context
    const activeRestaurantId = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )
    const { restaurantId } = useParams()

    const currentId = activeRestaurantId || restaurantId

    // 2. Build dynamic navigation tree
    const dynamicNavigationTree = useMemo(() => {
        if (!currentId) {
            return navigationConfig.filter((node) => node.key === 'dashboard')
        }

        const treeCopy = cloneDeep(navigationConfig)

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

    const navColor = (navType: string, mode: string) => {
        return `${navType}-${mode}`
    }

    const handleChange = (selected: SelectedMenuItem) => {
        setSelectedMenu(selected)
    }

    const handleCollpase = () => {
        setSelectedMenu({})
        setActiveKeys([])
    }

    const handleSetActiveKey = (key: string[]) => {
        setActiveKeys(key)
    }

    const stackedSideNavSecondaryDirStyle = () => {
        let style = {}
        const marginValue = `${-STACKED_SIDE_NAV_SECONDARY_WIDTH}px`
        if (direction === DIR_LTR) {
            style = { marginLeft: marginValue }
        }

        if (direction === DIR_RTL) {
            style = { marginRight: marginValue }
        }

        return style
    }

    return (
        <>
            {larger.md && (
                <div className={`stacked-side-nav`}>
                    <StackedSideNavMini
                        className={`stacked-side-nav-mini  ${navColor(
                            'stacked-side-nav-mini',
                            mode,
                        )}`}
                        style={stackedSideNavDefaultStyle}
                        routeKey={currentRouteKey}
                        activeKeys={activeKeys}
                        mode={mode}
                        direction={direction}
                        // navigationTree={navigationConfig}
                        navigationTree={dynamicNavigationTree}
                        userAuthority={userAuthority || []}
                        selectedMenu={selectedMenu}
                        t={t as TraslationFn}
                        onChange={handleChange}
                        onSetActiveKey={handleSetActiveKey}
                    />
                    <div
                        className={`stacked-side-nav-secondary ${navColor(
                            'stacked-side-nav-secondary',
                            mode,
                        )}`}
                        style={{
                            width: STACKED_SIDE_NAV_SECONDARY_WIDTH,
                            ...(isEmpty(selectedMenu)
                                ? stackedSideNavSecondaryDirStyle()
                                : {}),
                        }}
                    >
                        {!isEmpty(selectedMenu) && (
                            <StackedSideNavSecondary
                                title={t(
                                    selectedMenu.translateKey as string,
                                    selectedMenu.title as string,
                                )}
                                // menu={selectedMenu.menu}
                                menu={dynamicNavigationTree}
                                routeKey={currentRouteKey}
                                direction={direction}
                                translationSetup={translationSetup}
                                userAuthority={userAuthority || []}
                                onCollapse={handleCollpase}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default StackedSideNav
