import classNames from 'classnames'
import type { TransactionType } from '@/@types/transaction'

const typeStyles: Record<TransactionType, string> = {
    order: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    reservation:
        'bg-violet-500/10 text-violet-600 dark:text-violet-400',
}

const TransactionTypeBadge = ({ type }: { type: TransactionType }) => (
    <span
        className={classNames(
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
            typeStyles[type],
        )}
    >
        {type}
    </span>
)

export default TransactionTypeBadge