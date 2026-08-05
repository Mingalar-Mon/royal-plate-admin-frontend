import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'

const ownerEditSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    password: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 6, {
            message: 'New password must be at least 6 characters long',
        }),
})

export type OwnerEditFormData = z.infer<typeof ownerEditSchema>

interface OwnerEditFormProps {
    onFormSubmit: (data: OwnerEditFormData) => void
    defaultValues: Partial<OwnerEditFormData>
    children?: React.ReactNode
}

const OwnerEditForm = ({
    onFormSubmit,
    defaultValues,
    children,
}: OwnerEditFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<OwnerEditFormData>({
        defaultValues,
        resolver: zodResolver(ownerEditSchema),
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Edit Merchant Account
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h4 className="mb-4">Profile Specifications</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Full Name"
                                            invalid={!!errors.name}
                                            errorMessage={errors.name?.message}
                                        >
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Email Address"
                                                invalid={!!errors.email}
                                                errorMessage={
                                                    errors.email?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="owner@merchant.com"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem label="Phone Number (Optional)">
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder="+959..."
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/10">
                            <h4 className="mb-1 text-sm font-bold text-amber-600 dark:text-amber-400">
                                Account Credentials Overwrite
                            </h4>
                            <p className="text-xs text-gray-400 mb-4">
                                Leave this input field entirely blank unless you
                                intend to forcefully overwrite this
                                merchant&apos;s current entry password.
                            </p>

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <FormItem
                                        label="Force New Password"
                                        invalid={!!errors.password}
                                        errorMessage={errors.password?.message}
                                    >
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="******"
                                        />
                                    </FormItem>
                                )}
                            />
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default OwnerEditForm
