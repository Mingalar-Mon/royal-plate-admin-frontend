import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbUpload } from 'react-icons/tb'
import { bannerValidationSchema } from '@/@types/banner.type'
import type { BannerFormData } from '@/@types/banner.type'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'
import { useUpdateBannerMutation } from '@/utils/custom-hooks/useBanner'

const typeOptions = [
    { value: 'in_app', label: 'In App (Link to Restaurant)' },
    { value: 'external', label: 'External Web Link' },
]

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

interface BannerEditModalProps {
    banner: any | null
    onClose: () => void
}

const BannerEditModal = ({ banner, onClose }: BannerEditModalProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null)

    const { mutate: updateBanner, isPending: isUpdating } =
        useUpdateBannerMutation()

    const { data: restaurantsResponse } = useGetRestaurantList()

    const restaurantOptions =
        restaurantsResponse?.data
            ?.filter((r) => r.profile)
            .map((r) => ({
                value: r.profile?.id,
                label: r.name,
            })) || []

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BannerFormData>({
        defaultValues: {
            image: banner?.image?.url || '',
            linkToRestaurant: banner?.linkToRestaurant || '',
            type: banner?.type || 'in_app',
        },
        resolver: zodResolver(bannerValidationSchema),
    })

    const currentBannerType = watch('type')

    const previewUrl = useMemo(() => {
        if (imageFile) return URL.createObjectURL(imageFile)
        return banner?.image?.url
    }, [imageFile, banner])

    if (!banner) return null

    const handleSave = (formData: BannerFormData) => {
        const body = new FormData()
        body.append('linkToRestaurant', formData.linkToRestaurant)
        body.append('type', formData.type)
        if (imageFile) {
            body.append('bannerImage', imageFile)
        }

        updateBanner(
            { id: banner.id, data: body },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Banner updated">
                            The banner has been updated successfully.
                        </Notification>,
                    )
                    onClose()
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger" title="Update failed">
                            Could not update the banner. Please try again.
                        </Notification>,
                    )
                },
            },
        )
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.push(
                <Notification type="warning" title="Unsupported File">
                    Please upload JPG, PNG, or WEBP.
                </Notification>,
            )
            e.target.value = ''
            return
        }

        if (file.size > MAX_SIZE) {
            toast.push(
                <Notification type="warning" title="File too large">
                    Image must be 5MB or smaller.
                </Notification>,
            )
            e.target.value = ''
            return
        }

        setImageFile(file)
        e.target.value = ''
    }

    return (
        <Dialog
            isOpen={Boolean(banner)}
            width={520}
            onClose={onClose}
            onRequestClose={isUpdating ? () => {} : onClose}
        >
            <Form onSubmit={handleSubmit(handleSave)}>
                <div className="p-6">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                        Edit Banner
                    </h3>
                    <p className="mb-5 text-xs text-gray-400">
                        {banner.type === 'in_app'
                            ? 'Linked to a restaurant'
                            : 'External campaign link'}
                    </p>

                    <div className="space-y-4">
                        <FormItem
                            label="Promotional Media Banner"
                            invalid={!!errors.image}
                            errorMessage={errors.image?.message}
                        >
                            <div
                                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-center transition-colors hover:border-primary dark:border-gray-700"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            'bannerEditFileInput',
                                        )
                                        ?.click()
                                }
                            >
                                <input
                                    id="bannerEditFileInput"
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                />
                                <TbUpload className="mb-1 text-3xl text-gray-400" />
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Click to select banner image
                                </p>
                                <p className="text-xs text-gray-400">
                                    JPG, PNG, WEBP (Max 5MB)
                                </p>
                            </div>
                            {previewUrl && (
                                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={previewUrl}
                                        alt="Banner preview"
                                        className="max-h-40 w-full object-cover"
                                    />
                                </div>
                            )}
                        </FormItem>

                        <Controller
                            name="linkToRestaurant"
                            control={control}
                            render={({ field }) =>
                                currentBannerType === 'in_app' ? (
                                    <FormItem
                                        label="Select a restaurant"
                                        invalid={!!errors.linkToRestaurant}
                                        errorMessage={
                                            errors.linkToRestaurant?.message
                                        }
                                    >
                                        <Select
                                            options={restaurantOptions}
                                            value={restaurantOptions.find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            )}
                                            placeholder="Search and select restaurant profile..."
                                            onChange={(opt) =>
                                                field.onChange(opt?.value)
                                            }
                                        />
                                    </FormItem>
                                ) : (
                                    <FormItem
                                        label="External Campaign Web Link"
                                        invalid={!!errors.linkToRestaurant}
                                        errorMessage={
                                            errors.linkToRestaurant?.message
                                        }
                                    >
                                        <Input
                                            {...field}
                                            placeholder="https://www.google.com/"
                                        />
                                    </FormItem>
                                )
                            }
                        />

                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <FormItem
                                    label="Banner Campaign Type"
                                    invalid={!!errors.type}
                                    errorMessage={errors.type?.message}
                                >
                                    <Select
                                        options={typeOptions}
                                        value={typeOptions.find(
                                            (opt) =>
                                                opt.value === field.value,
                                        )}
                                        onChange={(opt) => {
                                            field.onChange(opt?.value)
                                            setValue(
                                                'linkToRestaurant',
                                                '',
                                                {
                                                    shouldValidate: false,
                                                    shouldDirty: true,
                                                },
                                            )
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
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

export default BannerEditModal