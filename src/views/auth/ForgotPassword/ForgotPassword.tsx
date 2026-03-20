import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import OtpVerificationForm  from '@/views/auth/OtpVerification/components/OtpVerificationForm'

type ForgotPasswordProps = {
    signInUrl?: string,
    forgetPasswordUrl?: string

}


export const ForgotPasswordBase = ({
    signInUrl = '/sign-in',
    forgetPasswordUrl = '/forgot-password',
}: ForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()


    return (
        <div>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <OtpVerificationForm />
                        <div className="mt-4 text-center">
                            <span>Back to </span>
                            <ActionLink
                                to={forgetPasswordUrl}
                                className="heading-text font-bold"
                                themeColor={false}
                            >
                                Sign in
                            </ActionLink>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="mb-2">Forgot Password</h3>
                        <p className="font-semibold heading-text">
                            Please enter your email to receive a verification
                            code
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ForgotPasswordForm
                emailSent={emailSent}
                setMessage={setMessage}
                setEmailSent={setEmailSent}
            ></ForgotPasswordForm>

            <div className="mt-4 text-center">
                {emailSent ? (
                    <></>
                ) : (
                    <>
                        {' '}
                        <span>Back to </span>
                        <ActionLink
                            to={signInUrl}
                            className="heading-text font-bold"
                            themeColor={false}
                        >
                            Sign in
                        </ActionLink>
                    </>
                )}
            </div>
        </div>
    )
}

const ForgotPassword = () => {
    return <ForgotPasswordBase />
}

export default ForgotPassword
