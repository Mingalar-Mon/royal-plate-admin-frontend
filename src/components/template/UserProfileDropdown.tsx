import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { Spinner } from '@/components/ui/Spinner'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router'
import { PiSignOutDuotone } from 'react-icons/pi'
import { useAuth } from '@/auth'
import { useState, type JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = []

const _UserDropdown = () => {
    const { avatar, userName, email } = useSessionUser((state) => state.user)

    const userInitial = (userName || email || 'U')
        .trim()
        .charAt(0)
        .toUpperCase()

    const { signOut } = useAuth()

    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        if (isSigningOut) return
        setIsSigningOut(true)
        try {
            await signOut()
        } finally {
            setIsSigningOut(false)
        }
    }

    const avatarProps = {
        ...(avatar
            ? { src: avatar }
            : {
                  icon: (
                      <span className="font-bold text-[#8a6d14] dark:text-gold">
                          {userInitial}
                      </span>
                  ),
              }),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    {avatar ? (
                        <Avatar size={32} src={avatar} />
                    ) : (
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary-subtle dark:bg-primary-subtle text-primary dark:text-primary-mild font-bold text-lg transition-all duration-200 cursor-pointer">
                            {userInitial}
                        </div>
                    )}
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar
                        {...avatarProps}
                        className="bg-transparent dark:bg-transparent"
                    />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {userName || 'Anonymous'}
                        </div>
                        <div className="text-xs">
                            {email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item
                preventClose
                eventKey="Sign Out"
                className="gap-2"
                disabled={isSigningOut}
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    {isSigningOut ? <Spinner /> : <PiSignOutDuotone />}
                </span>
                <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
