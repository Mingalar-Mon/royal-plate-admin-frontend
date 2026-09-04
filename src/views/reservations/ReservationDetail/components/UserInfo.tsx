import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { TbUser, TbMail, TbPhone } from 'react-icons/tb'
import type { User } from '../../types/reservation.type'

const UserInfo = ({ user }: { user: User }) => {
    return (
        <Card>
            <h4 className="mb-4">Customer Information</h4>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        shape="circle"
                        src={user.profileImage}
                        icon={<TbUser />}
                    />
                    <span className="font-semibold">{user.name}</span>
                </div>
                {user.email && (
                    <div className="flex items-center gap-2">
                        <TbMail className="text-gray-500" />
                        <span>{user.email}</span>
                    </div>
                )}
                {user.phone && (
                    <div className="flex items-center gap-2">
                        <TbPhone className="text-gray-500" />
                        <span>{user.phone}</span>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default UserInfo
