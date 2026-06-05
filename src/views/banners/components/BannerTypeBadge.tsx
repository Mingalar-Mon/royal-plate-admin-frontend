const typeConfig = {
    in_app: { label: 'In App', color: 'bg-blue-100 text-blue-700' },
    external: { label: 'External', color: 'bg-purple-100 text-purple-700' },
}

const BannerTypeBadge = ({ type }: { type: keyof typeof typeConfig }) => {
    const config = typeConfig[type]
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
            {config.label}
        </span>
    )
}

export default BannerTypeBadge
