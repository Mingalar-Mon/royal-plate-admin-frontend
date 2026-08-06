// import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'

const ownerCreateSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    code: z.string().optional(),
})

export type OwnerCreateFormData = z.infer<typeof ownerCreateSchema>

interface OwnerCreateFormProps {
    onFormSubmit: (data: OwnerCreateFormData) => void
    children?: React.ReactNode
}

const OwnerCreateForm = ({ onFormSubmit, children }: OwnerCreateFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<OwnerCreateFormData>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            code: '',
        },
        resolver: zodResolver(ownerCreateSchema),
    })

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Onboard New Merchant
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Frame Box: Profile Parameters */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h4 className="mb-4">Profile Information</h4>
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
                                                placeholder="e.g., John Doe"
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
                                                    placeholder="owner@restaurant.com"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Contact Phone"
                                                invalid={!!errors.phone}
                                                errorMessage={
                                                    errors.phone?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="+959..."
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Sidebar: Security Code & Base Access Tokens */}
                    <div className="space-y-6">
                        <Card>
                            <h4 className="mb-4">Credentials & Security</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Account Password"
                                            invalid={!!errors.password}
                                            errorMessage={
                                                errors.password?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="******"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="code"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Merchant System Code (Optional)">
                                            <Input
                                                {...field}
                                                placeholder="e.g., MCH-2026"
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default OwnerCreateForm
