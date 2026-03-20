export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/auth/login',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: 'auth/super-admin/send-otp',
    resetPassword: '/reset-password',
    verifyOtp: 'auth/super-admin/verify-otp'
}

export default endpointConfig
