// const Home = () => {
//     return <div>Home</div>
// }

// export default Home

import { useNavigate } from 'react-router'
import { useSessionUser } from '@/store/authStore'
import { useRestaurantStore } from '@/store/restaurantStore'
// import { useSessionUser } from '@/store/authStore'
import Container from '@/components/shared/Container'
// import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Card from '@/components/ui/Card'
// import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import {
    TbBuildingStore,
    TbUsers,
    TbArticle,
    TbUserCheck,
    TbToolsKitchen2,
    TbClipboardList,
    TbCalendarTime,
    TbDeviceAnalytics,
    TbArrowUpRight,
} from 'react-icons/tb'
import dayjs from 'dayjs'

const Home = () => {
    const navigate = useNavigate()

    // 1. Pull user identity and designation context from auth store
    const user = useSessionUser((state) => state.user)
    const activeRestaurant = useRestaurantStore(
        (state) => state.activeRestaurant,
    )

    const isSuperAdmin = user.authority?.includes('admin') || false
    const isOwner = user.authority?.includes('owner') || false

    // Quick navigation controller maps
    const handleQuickAction = (path: string) => {
        navigate(path)
    }

    return (
        <Container>
            <div className="py-6 space-y-6">
                {/* 🚀 STEP A: HIGH-IMPACT RESPONSE WELCOME HEADER BANNER */}
                <Card className="bg-radial-gradient border-none bg-gradient-to-r from-primary/10 via-transparent to-primary/5 dark:from-primary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
                        <div className="flex items-center gap-4">
                            <Avatar
                                shape="circle"
                                size={60}
                                src={user.avatar || ''}
                                className="bg-primary/20 text-primary border border-primary/20 shadow-sm"
                                icon={<TbUserCheck />}
                            />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                                    Welcome back, {user.userName || 'Manager'}!
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    System Status: Operational •{' '}
                                    {dayjs().format('dddd, DD MMM YYYY')}
                                </p>
                            </div>
                        </div>

                        {activeRestaurant && (
                            <div className="flex items-center gap-2.5 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border dark:border-gray-700 shadow-sm self-start sm:self-auto">
                                <TbBuildingStore className="text-primary text-xl" />
                                <div className="text-left">
                                    <span className="text-xs block text-gray-400 font-medium leading-none">
                                        Active Context
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {activeRestaurant.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 🚀 STEP B: CONDITIONAL EXECUTIVE CONTROL PANELS GATES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <h4 className="mb-4 text-gray-900 dark:text-gray-100">
                                Command Control Center
                            </h4>
                            <p className="text-sm text-gray-400 mb-6">
                                Select an operational category node below to
                                manage registers, adjust inventories, or
                                cross-reference auditing tables collections
                                lines.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {isSuperAdmin && (
                                    <>
                                        <div
                                            className="p-4 border dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl cursor-pointer group transition-all bg-gray-50/50 dark:bg-gray-800/20"
                                            onClick={() =>
                                                handleQuickAction(
                                                    '/admin/restaurants',
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                    <TbBuildingStore
                                                        size={22}
                                                    />
                                                </div>
                                                <TbArrowUpRight
                                                    className="text-gray-300 group-hover:text-primary transition-colors"
                                                    size={18}
                                                />
                                            </div>
                                            <h5 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                Merchant Directory
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Audit every registered
                                                restaurant asset and
                                                geolocations configuration
                                                parameter.
                                            </p>
                                        </div>

                                        <div
                                            className="p-4 border dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl cursor-pointer group transition-all bg-gray-50/50 dark:bg-gray-800/20"
                                            onClick={() =>
                                                handleQuickAction('/owners')
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                                    <TbUsers size={22} />
                                                </div>
                                                <TbArrowUpRight
                                                    className="text-gray-300 group-hover:text-primary transition-colors"
                                                    size={18}
                                                />
                                            </div>
                                            <h5 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                Owner Management
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Onboard restaurant merchants,
                                                reset accounts, or monitor
                                                security code tokens.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {(isOwner || activeRestaurant) && (
                                    <>
                                        <div
                                            className="p-4 border dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl cursor-pointer group transition-all bg-gray-50/50 dark:bg-gray-800/20"
                                            onClick={() =>
                                                handleQuickAction(
                                                    activeRestaurant
                                                        ? `/restaurants/${activeRestaurant.id}/orders`
                                                        : '/owner/dashboard',
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                                    <TbClipboardList
                                                        size={22}
                                                    />
                                                </div>
                                                <TbArrowUpRight
                                                    className="text-gray-300 group-hover:text-primary transition-colors"
                                                    size={18}
                                                />
                                            </div>
                                            <h5 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                Live Order Console
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Track active kitchen pipelines,
                                                process pick-ups, and update
                                                order flags.
                                            </p>
                                        </div>

                                        <div
                                            className="p-4 border dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl cursor-pointer group transition-all bg-gray-50/50 dark:bg-gray-800/20"
                                            onClick={() =>
                                                handleQuickAction(
                                                    activeRestaurant
                                                        ? `/restaurants/${activeRestaurant.id}/dishes`
                                                        : '/owner/dashboard',
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                                    <TbToolsKitchen2
                                                        size={22}
                                                    />
                                                </div>
                                                <TbArrowUpRight
                                                    className="text-gray-300 group-hover:text-primary transition-colors"
                                                    size={18}
                                                />
                                            </div>
                                            <h5 className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                                                Menu Composition
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Adjust dish listings pricing,
                                                upload digital S3 file assets,
                                                or set categories.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* 🚀 STEP C: SIDEBAR ANALYTICS CONTEXT SUMMARY BOX */}
                    <div className="space-y-6">
                        <Card>
                            <h4 className="mb-4 text-gray-900 dark:text-gray-100">
                                Quick Diagnostics
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <TbDeviceAnalytics /> Engine Target
                                    </span>
                                    <span className="font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                                        Production
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <TbCalendarTime /> Storage Relay
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                                        DigitalOcean S3
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <TbArticle /> Account Tier
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize text-xs">
                                        {user.authority?.join(', ') || 'Staff'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Home
