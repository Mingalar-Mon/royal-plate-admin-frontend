const DishStatusBadge = ({ available }: { available: boolean }) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${available ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'}`}
        >
            {available ? 'Available' : 'Unavailable'}
        </span>
    )
}

export default DishStatusBadge
