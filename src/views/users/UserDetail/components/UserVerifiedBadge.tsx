const UserVerifiedBadge = ({ isVerified }: { isVerified: boolean }) => (
    <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
        }`}
    >
        {isVerified ? 'Verified' : 'Unverified'}
    </span>
)

export default UserVerifiedBadge
