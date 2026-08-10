import {
    TbClock,
    TbCheck,
    TbX,
    TbCircleCheck,
    TbArmchair,
    TbUserOff,
    TbBan,
} from 'react-icons/tb'

export enum ReservationStatus {
    CONFIRMED = 'confirmed',
    PENDING = 'pending',
    CANCELED = 'canceled',
    COMPLETED = 'completed',
    SEATED = 'seated',
    NO_SHOW = 'no_show',
    REJECTED = 'rejected',
}

export const ReservationStatusColor = {
    [ReservationStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: TbClock,
    },
    [ReservationStatus.CONFIRMED]: {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-700',
        icon: TbCheck,
    },
    [ReservationStatus.CANCELED]: {
        label: 'Canceled',
        color: 'bg-red-100 text-red-700',
        icon: TbX,
    },
    [ReservationStatus.COMPLETED]: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-700',
        icon: TbCircleCheck,
    },
    [ReservationStatus.SEATED]: {
        label: 'Seated',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: TbArmchair,
    },
    [ReservationStatus.NO_SHOW]: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        icon: TbUserOff,
    },
    [ReservationStatus.REJECTED]: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: TbBan,
    },
}
