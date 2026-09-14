import { Suspense } from 'react'
import PageLoading from '@/components/shared/PageLoading'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import { useLocation } from 'react-router'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)
    const location = useLocation()
    const isLanding = location.pathname === '/landing'

    const { authenticated } = useAuth()

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-screen">
                    <PageLoading />
                </div>
            }
        >
            {authenticated && !isLanding ? (
                <PostLoginLayout layoutType={layoutType}>
                    {children}
                </PostLoginLayout>
            ) : (
                <PreLoginLayout>{children}</PreLoginLayout>
            )}
        </Suspense>
    )
}

export default Layout
