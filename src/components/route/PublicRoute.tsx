import { Navigate, Outlet, useLocation } from 'react-router'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'

const { authenticatedEntryPath, unAuthenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()
    const location = useLocation()

    // Public landing page is available to everyone
    if (location.pathname === '/landing') {
        return <Outlet />
    }

    // Allow direct access to sign-in pages
    if (
        location.pathname === '/sign-in' ||
        location.pathname === '/admin/sign-in'
    ) {
        return <Outlet />
    }

    // Any other public path redirects to the public entry page
    return <Navigate replace to={unAuthenticatedEntryPath} />
}

export default PublicRoute
