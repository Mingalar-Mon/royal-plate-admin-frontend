import { useRef, useImperativeHandle, useState } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router'
import type {
    SignInCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
    SignUpCredential,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router'

import { STAFF } from '@/constants/roles.constant'
import { useRestaurantStore } from '@/store/restaurantStore'
import { getDeviceToken } from '@/notifications/firebase'
import { apiRegisterDeviceToken } from '@/services/NotificationService'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])

    return <></>
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()
    const [tokenState, setTokenState] = useState(token)

    const authenticated = Boolean(tokenState && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    // bmk changes
    const { activeRestaurant, setActiveRestaurant } = useRestaurantStore()

    const redirect = (currentUser?: User) => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        console.log('Redirect Url: ', redirectUrl)

        if (redirectUrl) {
            navigatorRef.current?.navigate(redirectUrl)
            return
        }

        console.log('user in redirect fn=', user)
        // Logic for role-based landing pages
        const activeUser = currentUser || user
        const role = (activeUser.authority as string[])[0]
        console.log('ROlE: ', role)

        switch (role) {
            case 'ADMIN': // can change this to SUPER_ADMIN later
                console.log('Navigating to admin dashboard showing owner list')
                navigatorRef.current?.navigate('/owners')
                break
            case 'OWNER':
                console.log('Navigating to owner dashboard...')
                navigatorRef.current?.navigate('/owner/dashboard')
                break
            case 'STAFF':
                navigatorRef.current?.navigate(
                    `/restaurants/${activeRestaurant?.id}/dashboard`,
                )
                // navigatorRef.current?.navigate('/staff/dashboard')
                break
            default:
                console.log(`Navigating to home since Role: ${role}`)
                navigatorRef.current?.navigate(appConfig.authenticatedEntryPath)
        }

        // navigatorRef.current?.navigate(
        //     redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        // )
    }
    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)

        console.log('TOKEN:', tokens.accessToken)
        // console.log('USER:', user)

        if (user) {
            console.log('Setting the user with the following data', user)
            setUser(user)
        }

        getDeviceToken().then((fcmToken) => {
            if (fcmToken) {
                apiRegisterDeviceToken(fcmToken, 'web').catch((err) =>
                    console.error('Failed to register FCM device token:', err),
                )
            }
        })
    }

    const handleSignOut = () => {
        setToken('')
        setUser({})
        setActiveRestaurant(null)
        setSessionSignedIn(false)
    }

    const signIn = async (
        values: SignInCredential & { role: string },
    ): AuthResult => {
        try {
            const { role, ...credentials } = values
            const resp = await apiSignIn(credentials, role)

            console.log('resp:', resp)

            if (resp?.data) {
                const { token, user } = resp.data

                // ✅ normalize user
                const normalizedUser = {
                    userId: user.id,
                    userName: user.name,
                    email: user.email,
                    avatar: '', // backend doesn't provide → default
                    authority: user.role ? [user.role.name] : [],
                }

                // if (user.role?.name === STAFF && user.restaurant) {
                //     setActiveRestaurant({
                //         id: user.restaurant.id,
                //         name: user.restaurant.name,
                //     })
                // }

                console.log(normalizedUser)

                // ======= One Signal Staffs =======
                /*
                if (typeof window !== 'undefined' && window.OneSignal) {
                    // Wait for the internal SDK state to settle
                    await window.OneSignal.initialized

                    console.log(
                        'Syncing External ID to OneSignal:',
                        normalizedUser.userId,
                    )
                    await window.OneSignal.login(normalizedUser.userId)
                }
                // await OneSignal.login(normalizedUser.userId)
                */

                handleSignIn({ accessToken: token }, normalizedUser)

                redirect(normalizedUser)

                return {
                    status: 'success',
                    message: '',

                    ...(user.role &&
                        user.role.name === STAFF &&
                        user.restaurant && {
                            isStaff: {
                                restaurantId: user.restaurant.id,
                                restaurantName: user.restaurant.name,
                            },
                        }),
                }

                /*
                if(user.role?.name === STAFF && user.restaurant) {
                    response.isStaff = {
                        restaurantId: user.restaurant.id,
                        restaurantName: user.restaurant.name
                    }
                }
                    */

                // return response
            }

            return {
                status: 'failed',
                message: 'Invalid response structure',
            }
        } catch (errors: any) {
            console.error('LOGIN ERROR:', errors)

            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const resp = await apiSignUp(values)
            if (resp) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign up',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate('/')
        }
    }
    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
