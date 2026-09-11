import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useUpdateOwner } from '@/utils/custom-hooks/useOwner'

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

type OwnerEditFormData = z.infer<typeof ownerEditSchema>

interface OwnerEditModalProps {
    owner: any | null
    onClose: () => void
}

const OwnerEditModal = ({ owner, onClose }: OwnerEditModalProps) => {
    const { mutate: updateOwner, isPending: isUpdating } = useUpdateOwner()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<OwnerEditFormData>({
        defaultValues: {
            name: owner?.name || '',
            email: owner?.email || '',
            phone: owner?.phone || '',
            password: '',
        },
        resolver: zodResolver(ownerEditSchema),
    })

    if (!owner) return null

    const handleSave = (formData: OwnerEditFormData) => {
        const payload: any = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
        }

        if (formData.password) {
            payload.password = formData.password
        }

        updateOwner(
            { id: owner.id, data: payload },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Owner updated">
                            The owner profile has been updated successfully.
                        </Notification>,
                    )
                    onClose()
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger" title="Update failed">
                            Could not update the owner. Please try again.
                        </Notification>,
                    )
                },
            },
        )
    }

    return (
        <Dialog
            isOpen={Boolean(owner)}
            width={520}
            onClose={onClose}
            onRequestClose={isUpdating ? () => {} : onClose}
        >
            <Form onSubmit={handleSubmit(handleSave)}>
                <div className="p-6">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                        Edit Merchant Account
                    </h3>
                    <p className="mb-5 text-xs text-gray-400">
                        {owner.name} · {owner.email}
                    </p>

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
                                    <Input {...field} placeholder="John Doe" />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-900/10">
                            <p className="mb-3 text-xs font-bold text-amber-600 dark:text-amber-400">
                                Account Credentials Overwrite
                            </p>
                            <p className="mb-3 text-xs text-gray-400">
                                Leave blank unless you intend to force a new
                                password.
                            </p>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <FormItem
                                        label="Force New Password"
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
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 rounded-b-2xl bg-gray-100 px-6 py-3 dark:bg-gray-700">
                    <Button
                        size="sm"
                        onClick={onClose}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        type="submit"
                        loading={isUpdating}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

export default OwnerEditModal