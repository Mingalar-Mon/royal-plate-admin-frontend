import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiUsersDuotone, // Perfect for general Users management
    PiCrownDuotone, // Ideal for business Owners / VIPs
    PiImageDuotone, // Great for Banners / Heros / Carousels
    PiForkKnifeDuotone, // Fits perfectly for Cuisine / Menu / Restaurants
    PiSquaresFourDuotone, // Clean, modern style for Dashboard
    PiCookingPotDuotone, // Perfect for a Food Menu / Recipes item
    PiIdentificationCardDuotone, // Professional look for Staff / Employees
    PiGridFourDuotone, // Fits perfectly for Restaurant Tables / Seating
    PiArticleDuotone, // Great layout metaphor for Blogs / News / Articles
    PiStorefrontDuotone, // Restaurant / Storefront for Profile
    PiDeviceMobileDuotone, // Perfect for App Version management
    PiReceiptDuotone, // Perfect for Transactions / Statements
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,

    users: <PiUsersDuotone />,
    owners: <PiCrownDuotone />,
    banner: <PiImageDuotone />,
    cuisine: <PiForkKnifeDuotone />,

    dashboard: <PiSquaresFourDuotone />,
    menu: <PiCookingPotDuotone />,
    staffs: <PiIdentificationCardDuotone />,
    table: <PiGridFourDuotone />,
    blogs: <PiArticleDuotone />,
    profile: <PiStorefrontDuotone />,
    appVersion: <PiDeviceMobileDuotone />,
    commission: <PiBagSimpleDuotone />,
    transaction: <PiReceiptDuotone />,
}

export default navigationIcon
