const roleConfig = {
    manager: { label: 'Manager', color: 'bg-purple-100 text-purple-700' },
    staff: { label: 'Staff', color: 'bg-blue-100 text-blue-700' },
    cashier: { label: 'Cashier', color: 'bg-green-100 text-green-700' },
    chef: { label: 'Chef', color: 'bg-orange-100 text-orange-700' },
}
interface StaffRoleBadgeProps {
    role: keyof typeof roleConfig | string
}

const StaffRoleBadge = ({ role }: StaffRoleBadgeProps) => {
    const config = roleConfig[role as keyof typeof roleConfig] || {
        label: role,
        color: 'bg-gray-100 text-gray-700',
    }
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
            {config.label}
        </span>
    )
}

export default StaffRoleBadge
