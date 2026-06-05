import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import VerticalMenuIcon from './VerticalMenuIcon'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import type { CommonProps, TraslationFn } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useParams } from 'react-router'
import { useMemo } from 'react'
import navigationConfig from '@/configs/navigation.config'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TraslationFn
    indent?: boolean
    dotIndent?: boolean
    children?: React.ReactNode
    userAuthority: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
    renderAsIcon?: boolean
    currentKey?: string
    parentKeys?: string[]
    children?: React.ReactNode
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({
    nav,
    indent,
    dotIndent,
    children,
    userAuthority,
    t,
}: DefaultItemProps) => {
    // 1. Get the current selection context
    const activeRestaurantId = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )

    const { restaurantId } = useParams()

    const currentId = activeRestaurantId || restaurantId

    // 2. Build the live dynamic navigation tree
    const dynamicNavigationTree = useMemo(() => {
        if (!currentId) {
            return navigationConfig.filter((node) => node.key === 'dashboard')
        }
    }, [currentId])
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuCollapse
                key={nav.key}
                label={
                    <>
                        <VerticalMenuIcon icon={nav.icon} />
                        <span>{t(nav.translateKey, nav.title)}</span>
                    </>
                }
                eventKey={nav.key}
                expanded={false}
                dotIndent={dotIndent}
                indent={indent}
                // className="bg-amber-300"
            >
                {children}
            </MenuCollapse>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    direction,
    children,
    t,
    renderAsIcon,
    userAuthority,
    parentKeys,
}: CollapsedItemProps) => {
    const menuItem = (
        <MenuItem
            key={nav.key}
            isActive={parentKeys?.includes(nav.key)}
            eventKey={nav.key}
            className="mb-2"
        >
            <VerticalMenuIcon icon={nav.icon} />
        </MenuItem>
    )

    const dropdownItem = (
        <div key={nav.key}>{t(nav.translateKey, nav.title)}</div>
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <Dropdown
                trigger="hover"
                renderTitle={renderAsIcon ? menuItem : dropdownItem}
                placement={direction === 'rtl' ? 'left-start' : 'right-start'}
            >
                {children}
            </Dropdown>
        </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItem = ({
    sideCollapsed,
    ...rest
}: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
