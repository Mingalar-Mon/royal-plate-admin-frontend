import { HiOutlineMenuAlt2, HiOutlineMenu } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'

export interface NavToggleProps extends CommonProps {
    toggled?: boolean
}

const NavToggle = ({ toggled, className }: NavToggleProps) => {
    return (
        <div className={className}>
            {toggled ? (
                <HiOutlineMenu className="text-primary dark:text-primary-mild" />
            ) : (
                <HiOutlineMenuAlt2 className="text-primary dark:text-primary-mild" />
            )}
        </div>
    )
}

export default NavToggle
