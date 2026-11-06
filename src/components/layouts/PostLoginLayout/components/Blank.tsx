import { CommonProps } from '@/@types/common_type'
import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_BLANK } from '@/constants/theme.constant'

const Blank = ({ children }: CommonProps) => {
    return (
        <div className="app-layout-blank flex flex-auto flex-col h-screen" style={{ height: '100dvh' }}>
            <div className="flex min-w-0 w-full flex-1">{children}</div>
        </div>
    )
}

export default Blank
