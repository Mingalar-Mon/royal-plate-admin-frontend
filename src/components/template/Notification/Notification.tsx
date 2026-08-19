import { useEffect, useState, useRef, useCallback } from 'react'
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
import { HiOutlineMailOpen, HiOutlineBell } from 'react-icons/hi'
import { HiArrowRight } from 'react-icons/hi2'
import { useRestaurantStore } from '@/store/restaurantStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { DropdownRef } from '@/components/ui/Dropdown'
import type { NotificationItem } from '@/@types/notification'

dayjs.extend(relativeTime)

const notificationHeight = 'h-[320px]'

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<NotificationItem[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { larger } = useResponsive()
    const navigate = useNavigate()
    const notificationDropdownRef = useRef<DropdownRef>(null)

    const restaurantId = useRestaurantStore((state) => state.activeRestaurant?.id)

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
        if (notificationList.length === 0) {
            setLoading(true)
            try {
                const resp = await apiGetNotificationList(restaurantId, { limit: 20 })
                setNotificationList(resp.data)
            } catch {
                setNotificationList([])
            }
            setLoading(false)
        }
    }

    const onMarkAllAsRead = async () => {
        if (!restaurantId) return
        try {
            await apiMarkAllNotificationsRead(restaurantId)
            const list = notificationList.map((item) => ({ ...item, isRead: true }))
            setNotificationList(list)
            setUnreadCount(0)
            setNoResult(true)
        } catch (err) {
            console.error('Failed to mark all as read', err)
        }
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

    const handleViewAllActivity = () => {
        navigate('/concepts/account/activity-log')
        if (notificationDropdownRef.current) {
            notificationDropdownRef.current.handleDropdownClose()
        }
    }

    if (!restaurantId) return null

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadCount > 0}
                    className={className}
                />
            }
            menuClass="min-w-[340px] md:min-w-[380px] !p-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <div className="px-5 pt-5 pb-3 bg-gradient-to-br from-[#2a0a10] via-primary-deep to-primary">
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
                                    {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    {notificationList.length > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            title="Mark all as read"
                            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-200 px-3 py-1.5 rounded-lg backdrop-blur-sm cursor-pointer border-0"
                        >
                            <HiOutlineMailOpen className="text-sm" />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>
            </div>

            <ScrollBar className={classNames('overflow-y-auto', notificationHeight)}>
                {notificationList.length > 0 &&
                    notificationList.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={classNames(
                                    'relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200',
                                    'hover:bg-primary-subtle dark:hover:bg-primary-subtle',
                                    !item.isRead
                                        ? 'bg-primary-subtle dark:bg-primary-subtle'
                                        : 'bg-white dark:bg-gray-900',
                                )}
                                onClick={() => onMarkAsRead(item.id)}
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
                                    <span className="inline-block mt-1 text-xs text-primary dark:text-primary-mild font-medium">
                                        {dayjs(item.created_at).fromNow()}
                                    </span>
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
                            {!isLastChild(notificationList, index) && (
                                <div className="border-b border-gray-100 dark:border-gray-800 mx-4" />
                            )}
                        </div>
                    ))}

                {loading && (
                    <div className={classNames('flex flex-col items-center justify-center gap-3', notificationHeight)}>
                        <Spinner size={36} />
                        <p className="text-sm text-gray-400">Loading notifications…</p>
                    </div>
                )}

                {noResult && notificationList.length === 0 && !loading && (
                    <div className={classNames('flex items-center justify-center', notificationHeight)}>
                        <div className="text-center px-6">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary-subtle dark:bg-primary-subtle flex items-center justify-center">
                                <HiOutlineBell className="text-3xl text-primary-mild" />
                            </div>
                            <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                You're all caught up!
                            </h6>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                No new notifications right now.
                            </p>
                        </div>
                    </div>
                )}
            </ScrollBar>

            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-700/60">
                <button
                    onClick={handleViewAllActivity}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-deep to-primary hover:from-primary-mild hover:to-primary-mild active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/25 cursor-pointer border-0"
                >
                    View All Activity
                    <HiArrowRight className="text-base" />
                </button>
            </div>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification