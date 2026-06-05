import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { Segment } from '@/components/ui'
import { getDeviceToken } from '@/notifications/firebase'
import { useRestaurantStore } from '@/store/restaurantStore'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema = z.object({
    email: z.string().min(1, { message: 'Please enter your email' }),
    password: z.string().min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    // 1. add state for the selected role
    const [userRole, setUserRole] = useState<string>('auth') // auth = admin endpoint

    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { setActiveRestaurant } = useRestaurantStore()

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: 'superadmin@gmail.com',
            password: '11111111!',
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const token = await getDeviceToken()

            // 2. pass the role along the credentials

            const result = await signIn({
                email,
                password,
                fcmToken: token || '',
                //'eepvIgSAcwK6Cz4q9ovivJ:APA91bFOxMdLTPuGf7YM-2k83sdfgF_HPi6G-umw5PGUZIVrpeHBa-0goSY26w6P_nKNNPAz_5mkbLgoZK2inrV7iymiJorob_AF5bwf6V09XQ_ii6VxjGo',
                role: userRole,
            })

            if (result.isStaff) {
                setActiveRestaurant({
                    id: result.isStaff.restaurantId,
                    name: result.isStaff.restaurantName,
                })
            }

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {/* 3. add the ui for role selection */}
            <div className="mb-6">
                <Segment
                    value={userRole}
                    // className="w-full justify-center"
                    size="md"
                    onChange={(value) => setUserRole(value as string)}
                >
                    <Segment.Item value="auth">Admin</Segment.Item>
                    <Segment.Item value="owner">Owner</Segment.Item>
                    <Segment.Item value="staff">Staff</Segment.Item>
                </Segment>
            </div>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder="Password"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
