import Dropdown from '@/components/ui/Dropdown'
import Spinner from '@/components/ui/Spinner'
import {
    ReservationStatus,
    ReservationStatusColor,
} from '@/utils/Status/reservationStatus'
import type { ReservationStatus as ReservationStatusValue } from '../types/reservation.type'
import { TbCheck } from 'react-icons/tb'

type ReservationStatusBadgeProps = {
    status: ReservationStatusValue
    onChange: (status: ReservationStatusValue) => void
    isLoading?: boolean
    readOnly?: boolean
}

const statusTransitions: Partial<
    Record<ReservationStatusValue, ReservationStatusValue[]>
> = {
    [ReservationStatus.PENDING]: [
        ReservationStatus.CONFIRMED,
        ReservationStatus.SEATED,
        ReservationStatus.COMPLETED,
        ReservationStatus.NO_SHOW,
        ReservationStatus.REJECTED,
    ],
    [ReservationStatus.CONFIRMED]: [ReservationStatus.COMPLETED],
    [ReservationStatus.SEATED]: [
        ReservationStatus.COMPLETED,
        ReservationStatus.NO_SHOW,
    ],
    [ReservationStatus.COMPLETED]: [ReservationStatus.NO_SHOW],
}

const terminalStatuses: ReservationStatusValue[] = [
    ReservationStatus.REJECTED,
    ReservationStatus.CANCELED,
    ReservationStatus.NO_SHOW,
]

const ReservationStatusBadge = ({
    status,
    onChange,
    isLoading = false,
    readOnly = false,
}: ReservationStatusBadgeProps) => {
    const current = ReservationStatusColor[status]
    const nextStatuses = statusTransitions[status] ?? []
    const isTerminal = terminalStatuses.includes(status)
    const selectableStatuses = [status, ...nextStatuses]

    if (isTerminal || readOnly) {
        return (
            <div
                className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${current.color}`}
            >
                <current.icon size={14} />
                {current.label}
            </div>
        )
    }

    return (
        <Dropdown
            renderTitle={
                <div
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-opacity ${current.color} ${isLoading ? 'opacity-60 pointer-events-none' : 'hover:brightness-95'}`}
                >
                    {isLoading ? (
                        <Spinner size={14} />
                    ) : (
                        <current.icon size={14} />
                    )}
                    {current.label}
                </div>
            }
            placement="bottom-start"
        >
            {selectableStatuses.map((key) => {
                const config = ReservationStatusColor[key]

                return (
                    <Dropdown.Item
                        key={key}
                        disabled={key === status || isLoading}
                        onClick={() => onChange(key)}
                    >
                        <div className="flex items-center gap-2 min-w-32">
                            <config.icon size={14} />
                            <span>{config.label}</span>
                            {key === status && (
                                <TbCheck className="ml-auto text-green-500" />
                            )}
                        </div>
                    </Dropdown.Item>
                )
            })}
        </Dropdown>
    )
}

export default ReservationStatusBadge
