import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            <div className="mb-6 mt-2 flex flex-col items-center">
                <div className="rounded-full overflow-hidden ring-2 ring-gold shadow-lg shadow-primary/10">
                    <img
                        src={emailOptLogo}
                        alt="Royal Plate"
                        className="h-11 w-11 md:h-14 md:w-14 object-cover"
                    />
                </div>
                <div className="mt-4 flex items-center gap-2 select-none">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold-light" />
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
                </div>
            </div>
            <div className="mb-6">
                <h2 className="mb-1 font-serif text-primary dark:text-gold-light text-2xl">
                    Welcome to Royal Plate
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sign in to manage your restaurant with ease
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm disableSubmit={disableSubmit} setMessage={setMessage} />
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
