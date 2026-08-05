import { useNavigate } from 'react-router'
import type { ReactNode } from 'react'
import dayjs from 'dayjs'
import { useSessionUser } from '@/store/authStore'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useGetRestaurant } from '@/utils/custom-hooks/useRestaurant'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import {
    TbArrowUpRight,
    TbBuildingStore,
    TbCalendarEvent,
    TbChefHat,
    TbClipboardList,
    TbLayoutGrid,
    TbMapPin,
    TbShieldCheck,
    TbSparkles,
    TbTable,
    TbUsers,
} from 'react-icons/tb'

type QuickAction = {
    title: string
    description: string
    path?: string
    icon: ReactNode
    tone: string
    disabled?: boolean
}

const Home = () => {
    const navigate = useNavigate()
    const user = useSessionUser((state) => state.user)
    const selectedRestaurant = useRestaurantStore(
        (state) => state.activeRestaurant,
    )

    const authorities = (user.authority ?? []).map((authority) =>
        authority.toUpperCase(),
    )
    const isAdmin = authorities.includes('ADMIN')
    const isOwner = authorities.includes('OWNER')
    const isStaff = authorities.includes('STAFF')
    const activeRestaurant = isOwner || isStaff ? selectedRestaurant : null
    const activeRestaurantId = activeRestaurant?.id ?? ''
    const { data: restaurantResponse, isLoading: isRestaurantLoading } =
        useGetRestaurant(activeRestaurantId)
    const resolvedRestaurantName = restaurantResponse?.data?.name
    const restaurantName =
        resolvedRestaurantName && resolvedRestaurantName !== activeRestaurantId
            ? resolvedRestaurantName
            : isRestaurantLoading
              ? 'Loading restaurant…'
              : 'Restaurant workspace'
    const displayName = user.userName?.trim() || 'Manager'
    const hour = dayjs().hour()
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
              ? 'Good afternoon'
              : 'Good evening'
    const today = dayjs().format('dddd, DD MMM YYYY')

    const roleLabel = isAdmin
        ? 'Administrator'
        : isOwner
          ? 'Restaurant owner'
          : isStaff
            ? 'Restaurant staff'
            : 'Team member'

    const contextActions: QuickAction[] = activeRestaurant
        ? [
              {
                  title: 'Orders',
                  description:
                      'Review incoming orders and keep service moving.',
                  path: `/restaurants/${activeRestaurant.id}/orders`,
                  icon: <TbClipboardList />,
                  tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              },
              {
                  title: 'Menu & dishes',
                  description: 'Update dishes, pricing, and menu availability.',
                  path: `/restaurants/${activeRestaurant.id}/dishes`,
                  icon: <TbChefHat />,
                  tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              },
              {
                  title: 'Reservations',
                  description: 'Stay ahead of bookings and table planning.',
                  path: `/restaurants/${activeRestaurant.id}/reservations`,
                  icon: <TbCalendarEvent />,
                  tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
              },
              {
                  title: 'Tables',
                  description: 'Manage your floor plan and table availability.',
                  path: `/restaurants/${activeRestaurant.id}/tables`,
                  icon: <TbTable />,
                  tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
              },
          ]
        : isOwner
          ? [
                {
                    title: 'Choose a restaurant',
                    description:
                        'Open your restaurant dashboard to select a workspace.',
                    path: '/owner/dashboard',
                    icon: <TbBuildingStore />,
                    tone: 'bg-primary/10 text-primary',
                },
            ]
          : isStaff
            ? [
                  {
                      title: 'Restaurant context required',
                      description:
                          'Ask an owner to assign your restaurant before managing operations.',
                      icon: <TbShieldCheck />,
                      tone: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
                      disabled: true,
                  },
              ]
            : []

    const adminActions: QuickAction[] = [
        {
            title: 'Owner directory',
            description: 'Onboard and manage restaurant owner accounts.',
            path: '/owners',
            icon: <TbBuildingStore />,
            tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        },
        {
            title: 'User management',
            description: 'Review platform users and account access.',
            path: '/users',
            icon: <TbUsers />,
            tone: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Cuisine library',
            description: 'Keep the platform’s cuisine categories organized.',
            path: '/cuisines',
            icon: <TbChefHat />,
            tone: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Banner campaigns',
            description: 'Manage the promotional banners shown in the app.',
            path: '/banners',
            icon: <TbSparkles />,
            tone: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
        },
    ]

    const quickActions = isAdmin ? adminActions : contextActions
    const primaryAction = isAdmin
        ? { label: 'View owner directory', path: '/owners' }
        : activeRestaurant
          ? {
                label: 'Open orders',
                path: `/restaurants/${activeRestaurant.id}/orders`,
            }
          : isOwner
            ? { label: 'Open dashboard', path: '/owner/dashboard' }
            : null

    return (
        <Container>
            <div className="space-y-6 py-6 sm:py-8">
                <Card
                    className="relative overflow-hidden border-none bg-gradient-to-br from-primary/[0.16] via-primary/[0.05] to-transparent shadow-sm dark:from-primary/[0.24] dark:via-primary/[0.08]"
                    bodyClass="relative p-0"
                >
                    <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <Avatar
                                shape="circle"
                                size={64}
                                src={user.avatar || ''}
                                className="shrink-0 border border-primary/20 bg-primary/15 text-primary shadow-sm"
                                icon={<TbUsers />}
                            />
                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            activeRestaurant || isAdmin
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                activeRestaurant || isAdmin
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                            }`}
                                        />
                                        {activeRestaurant || isAdmin
                                            ? 'Workspace ready'
                                            : 'Workspace selection needed'}
                                    </span>
                                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                                        {roleLabel}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                                    {greeting}, {displayName}
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    {isAdmin
                                        ? 'Keep the Royal Plate platform organized and ready for every restaurant team.'
                                        : activeRestaurant
                                          ? 'Everything you need to keep today’s restaurant operations running smoothly.'
                                          : 'Start by selecting a workspace, then jump into the tools you use most.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                            <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5 shadow-sm backdrop-blur dark:border-gray-700/70 dark:bg-gray-800/70">
                                <TbCalendarEvent className="text-lg text-primary" />
                                <div>
                                    {' '}
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Today
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                        {today}
                                    </p>
                                </div>
                            </div>
                            {primaryAction && (
                                <Button
                                    variant="solid"
                                    icon={<TbArrowUpRight />}
                                    iconAlignment="end"
                                    onClick={() => navigate(primaryAction.path)}
                                >
                                    {primaryAction.label}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="transition-shadow duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                {' '}
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Access level
                                </p>
                                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {roleLabel}
                                </p>
                            </div>
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                <TbShieldCheck className="text-xl" />
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            Your workspace is tailored to this role.
                        </p>
                    </Card>

                    <Card className="transition-shadow duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                {' '}
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Active workspace
                                </p>
                                <p className="mt-2 truncate text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {activeRestaurant
                                        ? restaurantName
                                        : 'Not selected'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
                                <TbBuildingStore className="text-xl" />
                            </div>
                        </div>
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbMapPin />
                            {activeRestaurant
                                ? 'Ready for restaurant operations'
                                : isOwner
                                  ? 'Select one to get started'
                                  : 'No restaurant assigned'}
                        </p>
                    </Card>

                    <Card className="transition-shadow duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                {' '}
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Next best action
                                </p>
                                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {isAdmin
                                        ? 'Review owners'
                                        : activeRestaurant
                                          ? 'Check orders'
                                          : 'Choose workspace'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                                <TbLayoutGrid className="text-xl" />
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            A simple place to begin your session.
                        </p>
                    </Card>
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {isAdmin ? 'Platform controls' : 'Daily workspace'}
                    </p>
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {isAdmin
                                    ? 'Keep the platform in shape'
                                    : 'Jump back into your workflow'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isAdmin
                                    ? 'Focused shortcuts for the areas you manage most.'
                                    : activeRestaurant
                                      ? `Shortcuts for ${restaurantName}.`
                                      : 'Your restaurant tools will appear here once a workspace is active.'}
                            </p>
                        </div>
                    </div>
                </div>

                {quickActions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => (
                            <Card
                                key={action.title}
                                className={`group transition-all duration-200 ${
                                    action.disabled
                                        ? 'opacity-80'
                                        : 'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg'
                                }`}
                                bodyClass="p-0"
                            >
                                <button
                                    type="button"
                                    disabled={action.disabled}
                                    aria-label={action.title}
                                    className="flex h-full w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                                    onClick={() =>
                                        action.path && navigate(action.path)
                                    }
                                >
                                    <div className="flex items-start justify-between gap-3 p-5">
                                        <span
                                            className={`rounded-xl p-3 text-xl ${action.tone}`}
                                        >
                                            {action.icon}
                                        </span>
                                        {!action.disabled && (
                                            <TbArrowUpRight className="text-lg text-gray-300 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary dark:text-gray-600" />
                                        )}
                                    </div>
                                    <div className="mt-auto px-5 pb-5">
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100">
                                            {action.title}
                                        </h4>
                                        <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                </button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed">
                        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                            <div className="rounded-2xl bg-gray-100 p-3 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                <TbShieldCheck className="text-2xl" />
                            </div>
                            <h4 className="mt-4 font-bold text-gray-900 dark:text-gray-100">
                                No shortcuts available yet
                            </h4>
                            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                                Your account does not have a workspace role yet.
                                Contact an administrator if you need access.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </Container>
    )
}

export default Home
