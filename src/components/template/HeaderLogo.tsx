import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router'
import { useSessionUser } from '@/store/authStore'
import { OWNER } from '@/constants/roles.constant'
import type { Mode } from '@/@types/theme'

const HeaderLogo = ({ mode }: { mode?: Mode }) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const userAuthority = useSessionUser((state) => state.user.authority)

    const logoPath =
        userAuthority && userAuthority.includes(OWNER)
            ? '/owner/dashboard'
            : appConfig.authenticatedEntryPath

    return (
        <Link to={logoPath}>
            <Logo
                imgClass="max-h-10"
                mode={mode || defaultMode}
                className="hidden lg:block"
            />
        </Link>
    )
}

export default HeaderLogo
