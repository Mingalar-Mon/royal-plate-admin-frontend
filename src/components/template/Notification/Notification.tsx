import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
    apiMarkNotificationRead,
    apiMarkAllNotificationsRead,
} from '@/services/NotificationService'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router'
import { useRestaurantStore } from '@/store/restaurantStore'
import {
    HiOutlineMailOpen,
    HiOutlineBell,
    HiOutlineFilter,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { DropdownRef } from '@/components/ui/Dropdown'
import type { NotificationItem } from '@/@types/notification'

dayjs.extend(relativeTime)

const notificationHeight = 'h-[380px]'

type FilterKey = 'all' | NotificationItem['category']

type NotificationGroup = {
    label: string
    items: NotificationItem[]
}

const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'order', label: 'Orders' },
    { key: 'reservation', label: 'Reservations' },
    { key: 'rating', label: 'Ratings' },
    { key: 'blog', label: 'Blogs' },
]

const emptyMessages: Record<FilterKey, string> = {
    all: 'No new notifications right now.',
    order: 'No order notifications right now.',
    reservation: 'No reservation notifications right now.',
    rating: 'No rating notifications right now.',
    blog: 'No blog notifications right now.',
}

const groupNotifications = (items: NotificationItem[]): NotificationGroup[] => {
    const groups: NotificationGroup[] = []
    const now = dayjs()

    items.forEach((item) => {
        const date = dayjs(item.created_at)
        let label = 'Earlier'

        if (date.isSame(now, 'day')) {
            label = 'Today'
        } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
            label = 'Yesterday'
        } else if (now.diff(date, 'day') <= 7) {
            label = 'This week'
        }

        let group = groups.find((entry) => entry.label === label)
        if (!group) {
            group = { label, items: [] }
            groups.push(group)
        }
        group.items.push(item)
    })

    return groups
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationItem[]
    >([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

    const { larger } = useResponsive()
    const navigate = useNavigate()
    const notificationDropdownRef = useRef<DropdownRef>(null)

    const restaurantId = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )

    const filteredList = useMemo(
        () =>
            activeFilter === 'all'
                ? notificationList
                : notificationList.filter(
                      (item) => item.category === activeFilter,
                  ),
        [notificationList, activeFilter],
    )

    const groupedList = useMemo(
        () => groupNotifications(filteredList),
        [filteredList],
    )

    const refreshCount = useCallback(async () => {
        if (!restaurantId) return
        try {
            const resp = await apiGetNotificationCount(restaurantId)
            setUnreadCount(resp.count)
            setNoResult(resp.count === 0)
        } catch {
            setNoResult(true)
        }
    }, [restaurantId])

    useEffect(() => {
        refreshCount()
    }, [refreshCount])

    const onNotificationOpen = async () => {
        if (!restaurantId) return
        refreshCount()
        setLoading(true)
        try {
            const resp = await apiGetNotificationList(restaurantId, {
                limit: 20,
            })
            setNotificationList(resp.data)
        } catch {
            setNotificationList([])
        }
        setLoading(false)
    }

    const onMarkAllAsRead = async () => {
        if (!restaurantId) return
        try {
            await apiMarkAllNotificationsRead(restaurantId)
            const list = notificationList.map((item) => ({
                ...item,
                isRead: true,
            }))
            setNotificationList(list)
            setUnreadCount(0)
            setNoResult(true)
        } catch (err) {
            console.error('Failed to mark all as read', err)
        }
    }

    const onNotificationClick = async (item: NotificationItem) => {
        await onMarkAsRead(item.id)

        if (!item.referenceId) return

        const basePath = restaurantId ? `/restaurants/${restaurantId}` : ''
        if (item.category === 'order') {
            navigate(`${basePath}/orders/${item.referenceId}`)
        } else if (item.category === 'reservation') {
            navigate(`${basePath}/reservations/detail/${item.referenceId}`)
        } else if (item.category === 'blog') {
            navigate(`${basePath}/blogs/${item.referenceId}`)
        } else if (item.category === 'rating') {
            navigate(`${basePath}/ratings`)
        }

        notificationDropdownRef.current?.handleDropdownClose()
    }

    const onMarkAsRead = async (id: string) => {
        try {
            await apiMarkNotificationRead(id)
            const list = notificationList.map((item) =>
                item.id === id ? { ...item, isRead: true } : item,
            )
            setNotificationList(list)
            refreshCount()
        } catch (err) {
            console.error('Failed to mark notification as read', err)
        }
    }

    if (!restaurantId) return null

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadCount > 0}
                    count={unreadCount}
                    className={className}
                />
            }
            menuClass="min-w-[340px] md:min-w-[380px] !p-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-[#2a0a10] via-primary-deep to-primary">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
                            <HiOutlineBell className="text-white text-xl" />
                        </div>
                        <div>
                            <h6 className="text-white font-semibold text-base leading-tight">
                                Notifications
                            </h6>
                            {unreadCount > 0 && (
                                <p className="text-white/75 text-xs mt-0.5">
                                    {unreadCount} unread message
                                    {unreadCount > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    {notificationList.length > 0 && (
                        <button
                            title="Mark all as read"
                            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-200 px-3 py-1.5 rounded-lg backdrop-blur-sm cursor-pointer border-0"
                            onClick={onMarkAllAsRead}
                        >
                            <HiOutlineMailOpen className="text-sm" />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                {filterTabs.map((tab) => {
                    const active = activeFilter === tab.key
                    return (
                        <button
                            key={tab.key}
                            className={classNames(
                                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer',
                                active
                                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-primary hover:border-primary/40',
                            )}
                            onClick={() => setActiveFilter(tab.key)}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <ScrollBar
                className={classNames('overflow-y-auto', notificationHeight)}
            >
                {loading && (
                    <div
                        className={classNames(
                            'flex flex-col items-center justify-center gap-3',
                            notificationHeight,
                        )}
                    >
                        <Spinner size={36} />
                        <p className="text-sm text-gray-400">
                            Loading notifications…
                        </p>
                    </div>
                )}

                {!loading &&
                    groupedList.map((group) => (
                        <div key={group.label}>
                            <div className="sticky top-0 z-10 flex items-center gap-1.5 px-5 py-2 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    {group.label}
                                </span>
                                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                    {group.items.length}
                                </span>
                            </div>
                            {group.items.map((item, index) => (
                                <div key={item.id}>
                                    <div
                                        className={classNames(
                                            'relative flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors duration-150',
                                            'hover:bg-primary-subtle dark:hover:bg-gray-800/60',
                                            !item.isRead
                                                ? 'bg-primary-subtle/60 dark:bg-primary-subtle/20'
                                                : 'bg-white dark:bg-gray-900',
                                        )}
                                        onClick={() =>
                                            void onNotificationClick(item)
                                        }
                                    >
                                        {!item.isRead && (
                                            <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-primary to-primary-mild" />
                                        )}

                                        <div className="flex-shrink-0 mt-0.5">
                                            <NotificationAvatar
                                                category={item.category}
                                                eventType={item.eventType}
                                                actorName={item.actorName}
                                                actorImage={item.actorImage}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 pr-5">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {item.title}{' '}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.body}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs text-primary dark:text-primary-mild font-medium">
                                                    {dayjs(
                                                        item.created_at,
                                                    ).fromNow()}
                                                </span>
                                                {!item.isRead && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary-subtle text-primary dark:text-primary-mild">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="absolute top-4 right-4 flex-shrink-0">
                                            <span
                                                className={classNames(
                                                    'block w-2 h-2 rounded-full',
                                                    item.isRead
                                                        ? 'bg-gray-300 dark:bg-gray-600'
                                                        : 'bg-primary shadow-sm shadow-primary/50',
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {!isLastChild(group.items, index) && (
                                        <div className="border-b border-gray-100 dark:border-gray-800 mx-5" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                {!loading && notificationList.length === 0 && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            notificationHeight,
                        )}
                    >
                        <div className="text-center px-6">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary-subtle dark:bg-primary-subtle flex items-center justify-center">
                                <HiOutlineBell className="text-3xl text-primary-mild" />
                            </div>
                            <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                {noResult
                                    ? "You're all caught up!"
                                    : 'No notifications yet'}
                            </h6>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                {emptyMessages.all}
                            </p>
                        </div>
                    </div>
                )}

                {!loading &&
                    notificationList.length > 0 &&
                    groupedList.length === 0 && (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight,
                            )}
                        >
                            <div className="text-center px-6">
                                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary-subtle dark:bg-primary-subtle flex items-center justify-center">
                                    <HiOutlineFilter className="text-3xl text-primary-mild" />
                                </div>
                                <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    Nothing here yet
                                </h6>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {emptyMessages[activeFilter]}
                                </p>
                            </div>
                        </div>
                    )}
            </ScrollBar>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
