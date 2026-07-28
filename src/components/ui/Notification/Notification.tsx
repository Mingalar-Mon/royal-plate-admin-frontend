import { useCallback, useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import useTimeout from '../hooks/useTimeout'
import CloseButton from '../CloseButton'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, MouseEvent, Ref } from 'react'
import {
    HiCheckCircle,
    HiXCircle,
    HiExclamationCircle,
    HiInformationCircle,
    HiBell,
} from 'react-icons/hi'
import { HiShoppingCart, HiCalendar } from 'react-icons/hi2'

export interface NotificationProps extends CommonProps {
    closable?: boolean
    customIcon?: ReactNode | string
    duration?: number
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    ref?: Ref<HTMLDivElement>
    title?: string
    triggerByToast?: boolean
    type?: TypeAttributes.Status
    width?: number | string
}

const typeConfig: Record<
    string,
    { icon: ReactNode; accentClass: string; iconBgClass: string; iconColorClass: string; progressClass: string }
> = {
    success: {
        icon: <HiCheckCircle />,
        accentClass: 'border-l-emerald-500',
        iconBgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
        iconColorClass: 'text-emerald-500',
        progressClass: 'bg-emerald-500',
    },
    danger: {
        icon: <HiXCircle />,
        accentClass: 'border-l-red-500',
        iconBgClass: 'bg-red-50 dark:bg-red-900/30',
        iconColorClass: 'text-red-500',
        progressClass: 'bg-red-500',
    },
    warning: {
        icon: <HiExclamationCircle />,
        accentClass: 'border-l-amber-500',
        iconBgClass: 'bg-amber-50 dark:bg-amber-900/30',
        iconColorClass: 'text-amber-500',
        progressClass: 'bg-amber-500',
    },
    info: {
        icon: <HiInformationCircle />,
        accentClass: 'border-l-indigo-500',
        iconBgClass: 'bg-indigo-50 dark:bg-indigo-900/30',
        iconColorClass: 'text-indigo-500',
        progressClass: 'bg-indigo-500',
    },
}

const Notification = (props: NotificationProps) => {
    const {
        className,
        children,
        closable = true,
        customIcon,
        duration = 5000,
        onClose,
        style,
        ref,
        title,
        triggerByToast,
        type,
        width = 380,
        ...rest
    } = props

    const [display, setDisplay] = useState('show')
    const [progress, setProgress] = useState(100)
    const startTimeRef = useRef<number>(Date.now())
    const rafRef = useRef<number | null>(null)

    const { clear } = useTimeout(onClose as () => void, duration, duration > 0)

    // Animated countdown progress bar
    useEffect(() => {
        if (duration <= 0) return
        startTimeRef.current = Date.now()

        const tick = () => {
            const elapsed = Date.now() - startTimeRef.current
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
            setProgress(remaining)
            if (remaining > 0) {
                rafRef.current = requestAnimationFrame(tick)
            }
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [duration])

    const handleClose = useCallback(
        (e: MouseEvent<HTMLSpanElement>) => {
            setDisplay('hiding')
            onClose?.(e)
            clear()
            if (!triggerByToast) {
                setTimeout(() => {
                    setDisplay('hide')
                }, 400)
            }
        },
        [onClose, clear, triggerByToast],
    )

    if (display === 'hide') return null

    const config = type ? typeConfig[type] : null

    // Detect order/reservation from title for custom icon
    const isOrder =
        title?.toLowerCase().includes('order') ||
        children?.toString().toLowerCase().includes('order')
    const isReservation =
        title?.toLowerCase().includes('reservation') ||
        children?.toString().toLowerCase().includes('reservation')

    const resolvedIcon = customIcon
        ? customIcon
        : config
          ? config.icon
          : isOrder
            ? <HiShoppingCart />
            : isReservation
              ? <HiCalendar />
              : <HiBell />

    const accentClass = config?.accentClass ?? 'border-l-indigo-500'
    const iconBgClass = config?.iconBgClass ?? 'bg-indigo-50 dark:bg-indigo-900/30'
    const iconColorClass = config?.iconColorClass ?? 'text-indigo-500'
    const progressClass = config?.progressClass ?? 'bg-indigo-500'

    return (
        <div
            ref={ref}
            {...rest}
            className={classNames(
                'notification-popup',
                'relative overflow-hidden rounded-2xl mb-3',
                'bg-white dark:bg-gray-800',
                'shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
                'border-l-4',
                accentClass,
                'border border-gray-100 dark:border-gray-700/50',
                className,
            )}
            style={{ width, ...style }}
        >
            {/* Content */}
            <div className="flex items-start gap-3.5 px-4 pt-4 pb-3">
                {/* Icon */}
                <div
                    className={classNames(
                        'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-xl',
                        iconBgClass,
                        iconColorClass,
                    )}
                >
                    {resolvedIcon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                    {title && (
                        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight mb-0.5">
                            {title}
                        </p>
                    )}
                    {children && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                            {children}
                        </p>
                    )}
                </div>

                {/* Close button */}
                {closable && (
                    <button
                        onClick={handleClose as any}
                        className="flex-shrink-0 -mt-0.5 -mr-1 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 cursor-pointer border-0 bg-transparent"
                        aria-label="Close"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Progress bar */}
            {duration > 0 && (
                <div className="h-0.5 w-full bg-gray-100 dark:bg-gray-700">
                    <div
                        className={classNames('h-full transition-none', progressClass)}
                        style={{ width: `${progress}%`, opacity: 0.7 }}
                    />
                </div>
            )}
        </div>
    )
}

export default Notification
