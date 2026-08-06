export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    // apiPrefix: 'http://localhost:3000/api',// '/api/proxy/api', // 'http://152.42.244.67/api', '/api/proxy/api', 'http://localhost:3000/api'
    // apiPrefix: '/api/proxy/api', // for vercel production
    apiPrefix: 'https://royal-plate-dev-server-bpcr2.ondigitalocean.app/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: false,
    activeNavTranslation: false,
}

export default appConfig
