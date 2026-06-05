import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import React from 'react'
import { useLoginOwner } from '../hooks/useOwner'
import { useNavigate } from 'react-router'
import OneSignal from 'react-onesignal'

type FormSchema = {
    email: string
    userName?: string
    password: string
    rememberMe?: boolean
}

const validationSchema = z.object({
    email: z
        .email({ message: 'Invalid email' })
        .min(1, { message: 'Email Required' }),
    // userName: z.string().min(3, 'Too Short!').max(12, 'Too Long!'),
    password: z
        .string()
        .min(1, { message: 'Password Required' })
        .min(8, { message: 'Too Short!' })
        .refine(
            (value) => /^[A-Za-z0-9_-]*$/.test(value),
            'Only Letters & Numbers Allowed',
        ),
    // rememberMe: z.boolean(),
})

const Basic = () => {
    const navigate = useNavigate()
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            email: '',
            // userName: '',
            password: '',
            // rememberMe: false,
        },
        resolver: zodResolver(validationSchema),
    })

    const loginMutation = useLoginOwner()
    const onSubmit = async (values: FormSchema) => {
        const { email, password } = values

        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    console.log('login successful with data: ', data)
                    // await OneSignal.login()
                    return navigate('/owner/dashboard', { replace: true })
                },
                onError: (error: unknown) => {
                    console.log('Error ', error)
                    // TODO: Changes to UI
                },
            },
        )
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Password"
                invalid={Boolean(errors.password)}
                errorMessage={errors.password?.message}
            >
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="password"
                            autoComplete="off"
                            placeholder="Password"
                            {...field}
                        />
                    )}
                />

                <Button
                    type="reset"
                    className="ltr:mr-2 rtl:ml-2"
                    onClick={() => reset()}
                >
                    Reset
                </Button>
                <Button variant="solid" type="submit">
                    Submit
                </Button>
            </FormItem>
        </Form>
    )
}

export default Basic
