const typeConfig = {
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700' },
    standard: { label: 'Standard', color: 'bg-blue-100 text-blue-700' },
    family: { label: 'Family', color: 'bg-green-100 text-green-700' },
}

// { type }: { type: keyof typeof typeConfig }
const TableTypeBadge = ({ type }: { type: string }) => {
    // const config = typeConfig[type]
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700`}
        >
            {type}
        </span>
    )
}

export default TableTypeBadge
