import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            {type === 'streamline' ? (
                <img
                    src={emailOptLogo}
                    alt={`${APP_NAME} logo`}
                    className={classNames(
                        'mx-auto rounded-3xl object-contain',
                        imgClass || 'max-h-8 w-8',
                    )}
                />
            ) : (
                <h4 className="text-primary dark:text-primary-mild whitespace-nowrap">
                    Royal Plate
                </h4>
            )}
        </div>
    )
}

export default Logo
