import { Navigate, Outlet, useLocation } from 'react-router'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { ADMIN, OWNER } from '@/constants/roles.constant'

const { authenticatedEntryPath, unAuthenticatedEntryPath } = appConfig

const signInPaths = ['/sign-in', '/admin/sign-in', '/owner/login']

const PublicRoute = () => {
    const { authenticated, user } = useAuth()
    const location = useLocation()

    // Public landing page and privacy policy are available to everyone
    if (location.pathname === '/landing' || location.pathname === '/privacy-policy') {
        return <Outlet />
    }

    if (signInPaths.includes(location.pathname)) {
        if (!authenticated) {
            return <Outlet />
        }

        const role = user.authority?.[0]
        if (role === ADMIN) {
            return <Navigate replace to="/owners" />
        }
        if (role === OWNER) {
            return <Navigate replace to="/owner/dashboard" />
        }
        return <Navigate replace to={authenticatedEntryPath} />
    }

    // Any other public path redirects to the public entry page
    return <Navigate replace to={unAuthenticatedEntryPath} />
}

export default PublicRoute
