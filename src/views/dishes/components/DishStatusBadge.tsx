const DishStatusBadge = ({ available }: { available: boolean }) => {
    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
            {available ? 'Available' : 'Unavailable'}
        </span>
    )
}

export default DishStatusBadge
