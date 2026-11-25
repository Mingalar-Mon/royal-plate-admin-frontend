import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormItem } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import PasswordInput from '@/components/shared/PasswordInput'
import type { AdminFormData, AdminRole } from '@/@types/admin'

export const MANUAL_ROLE = '__manual__'
const ADMIN_ROLE_NAMES = ['ADMIN', 'SUPER_ADMIN']
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const baseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be 100 characters or fewer'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z.string().max(50, 'Phone must be 50 characters or fewer'),
    code: z.string().max(100, 'Code must be 100 characters or fewer'),
    roleId: z.string(),
    manualRoleId: z.string(),
})

const validateRole = (
    values: { roleId: string; manualRoleId: string },
    ctx: z.RefinementCtx,
) => {
    if (
        values.roleId === MANUAL_ROLE &&
        !UUID_REGEX.test(values.manualRoleId)
    ) {
        ctx.addIssue({
            code: 'custom',
            path: ['manualRoleId'],
            message: 'Enter a valid role UUID',
        })
    }
}

const createSchema = baseSchema
    .extend({
        password: z.string().min(8, 'Password must be at least 8 characters'),
    })
    .superRefine(validateRole)

const updateSchema = baseSchema
    .extend({
        // Empty string means "keep the existing password"; apiUpdateAdmin
        // strips it out before sending the PATCH request.
        password: z.string().max(128, 'Password is too long'),
    })
    .superRefine(validateRole)

export type AdminCreateFormData = z.infer<typeof createSchema>
export type AdminEditFormData = z.infer<typeof updateSchema>

interface AdminFormProps {
    onFormSubmit: (data: AdminFormData) => void
    defaultValues?: Partial<AdminFormData>
    isNew?: boolean
    roleOptions?: AdminRole[]
    /** Current admin's own role, so it stays selectable when editing self. */
    currentRole?: AdminRole | null
    isSelf?: boolean
    children?: React.ReactNode
}

const emptyValues: AdminFormData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    code: '',
    roleId: '',
    manualRoleId: '',
}

const AdminForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    roleOptions = [],
    currentRole,
    isSelf = false,
    children,
}: AdminFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<AdminFormData>({
        defaultValues: { ...emptyValues, ...defaultValues },
        resolver: zodResolver(isNew ? createSchema : updateSchema),
    })

    useEffect(() => {
        // Create mode passes no defaults; don't wipe in-progress input when
        // the parent re-renders (e.g. while role options are loading).
        if (defaultValues) reset({ ...emptyValues, ...defaultValues })
    }, [defaultValues, reset])

    const selectedRole = watch('roleId')

    const options = useMemo(() => {
        const byId = new Map(roleOptions.map((role) => [role.id, role]))
        if (currentRole && !byId.has(currentRole.id)) {
            byId.set(currentRole.id, currentRole)
        }

        const roleList = Array.from(byId.values()).sort((a, b) =>
            a.name.localeCompare(b.name),
        )

        const result = isSelf ? [] : [{ value: '', label: 'No role' }]

        result.push(
            ...roleList.map((role) => ({
                value: role.id,
                label: `${role.name}${role.description ? ` — ${role.description}` : ''}`,
                isDisabled: isSelf && !ADMIN_ROLE_NAMES.includes(role.name),
            })),
            { value: MANUAL_ROLE, label: 'Enter a role UUID manually' },
        )

        return result
    }, [roleOptions, currentRole, isSelf])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">
                        {isNew ? 'Add New Admin' : 'Edit Admin'}
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
                                                placeholder="e.g., Jane Doe"
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
                                                placeholder="admin@example.com"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Phone (optional)"
                                                invalid={!!errors.phone}
                                                errorMessage={
                                                    errors.phone?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="+959123456789"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="code"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Code (optional)"
                                                invalid={!!errors.code}
                                                errorMessage={
                                                    errors.code?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="Optional code"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label={
                                                isNew
                                                    ? 'Password'
                                                    : 'New Password (leave blank to keep current)'
                                            }
                                            invalid={!!errors.password}
                                            errorMessage={
                                                errors.password?.message
                                            }
                                        >
                                            <PasswordInput
                                                {...field}
                                                autoComplete="new-password"
                                                placeholder="At least 8 characters"
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>

                        <Card>
                            <h4 className="mb-4">Role</h4>
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Roles listed here are taken from existing
                                admins. Choose “Enter a role UUID manually” if
                                the role you need is not listed.
                            </p>
                            <div className="space-y-4">
                                <Controller
                                    name="roleId"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Admin Role"
                                            invalid={!!errors.roleId}
                                            errorMessage={
                                                errors.roleId?.message
                                            }
                                        >
                                            <Select
                                                options={options}
                                                value={
                                                    options.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) ?? null
                                                }
                                                onChange={(option) =>
                                                    field.onChange(
                                                        option?.value ?? '',
                                                    )
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                {selectedRole === MANUAL_ROLE && (
                                    <Controller
                                        name="manualRoleId"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Role UUID"
                                                invalid={!!errors.manualRoleId}
                                                errorMessage={
                                                    errors.manualRoleId?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="00000000-0000-0000-0000-000000000000"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {isSelf && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        You cannot remove your own role or
                                        downgrade it to a non-admin role.
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default AdminForm
