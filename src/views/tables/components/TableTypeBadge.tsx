const typeConfig = {
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700' },
    standard: { label: 'Standard', color: 'bg-blue-100 text-blue-700' },
    family: { label: 'Family', color: 'bg-green-100 text-green-700' },
}

const TableTypeBadge = ({ type }: { type: keyof typeof typeConfig }) => {
    const config = typeConfig[type]
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
            {config.label}
        </span>
    )
}

export default TableTypeBadge
