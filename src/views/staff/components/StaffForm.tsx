import { useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
// import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import type { StaffFormData, StaffRole } from '../types/staff.types'

const baseStaffSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    role: z.enum(['staff', 'manager', 'cashier', 'chef']),
})

// 2. Create the specific schema variations
const createStaffSchema = baseStaffSchema.extend({
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const updateStaffSchema = baseStaffSchema.extend({
    password: z.string().optional().or(z.literal('')), // Optional on update
})
// 1. Conditional Schema: Forces password constraint ONLY if creating a new member
// const baseStaffObject = z.object({
//     name: z.string().min(1, 'Name is required'),
//     email: z.email('Invalid email address'),
//     role: z.enum(['manager', 'staff', 'cashier', 'chef']),
//     password: z
//         .string()
//         .min(6, 'Password must be at least 6 characters')
//         .optional(),
// })

// const staffSchema = baseStaffObject.superRefine((values, ctx) => {
//     // If it's not checked here, an empty password field passes validation but breaks the backend
//     if (!values.password || values.password.length < 6) {
//         ctx.addIssue({
//             code: 'custom',
//             message: 'Password must be at least 6 characters',
//             path: ['password'],
//         })
//     }
// })

// export type StaffFormData = z.infer<typeof staffSchema>
export type StaffCreateFormData = z.infer<typeof createStaffSchema>
export type StaffEditFormData = z.infer<typeof updateStaffSchema>

interface StaffFormProps {
    onFormSubmit: (data: StaffFormData) => void
    defaultValues?: Partial<StaffFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'chef', label: 'Chef' },
]

const StaffForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: StaffFormProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<StaffFormData>({
        defaultValues: defaultValues || {
            name: '',
            email: '',
            role: 'staff',
            password: '',
        },
        resolver: zodResolver(isNew ? createStaffSchema : updateStaffSchema),
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    // const onSubmit = (data: StaffFormData) => onFormSubmit(data)

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">
                        {isNew ? 'Add New Staff' : 'Edit Staff'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Basic Information</h4>
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
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Email Address"
                                            invalid={!!errors.email}
                                            errorMessage={errors.email?.message}
                                        >
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="staff@restaurant.com"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Role"
                                            invalid={!!errors.role}
                                            errorMessage={errors.role?.message}
                                        >
                                            <Select
                                                options={roleOptions}
                                                value={roleOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                {isNew && (
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Password"
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
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default StaffForm
