const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactive', color: 'bg-red-100 text-red-700' },
    maintenance: {
        label: 'Maintenance',
        color: 'bg-orange-100 text-orange-700',
    },
}

const TableStatusBadge = ({
    status,
}: {
    status: keyof typeof statusConfig
}) => {
    const config = statusConfig[status]
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
            {config.label}
        </span>
    )
}

export default TableStatusBadge
