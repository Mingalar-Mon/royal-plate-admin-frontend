import { useEffect, useState, useRef } from 'react'
import { useForm, Controller, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { TbUpload } from 'react-icons/tb'
import { bannerValidationSchema } from '@/@types/banner.type'
import type { BannerFormData } from '@/@types/banner.type'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'
import { Restaurant } from '@/@types/restaurant'
import CropModal from '@/components/shared/ImageCrop/CropModel'
import { Notification, toast } from '@/components/ui'

interface BannerFormProps {
    onFormSubmit: (data: BannerFormData) => void
    defaultValues?: Partial<BannerFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const typeOptions = [
    { value: 'in_app', label: 'In App (Link to Restaurant)' },
    { value: 'external', label: 'External Web Link' },
]

const BannerForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: BannerFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<BannerFormData>({
        defaultValues: defaultValues || {
            image: undefined,
            linkToRestaurant: '',
            type: 'in_app',
        },
        resolver: zodResolver(bannerValidationSchema),
    })

    // 1. Core single source of truth field tracking for image data slot
    const { field: imageField } = useController({ name: 'image', control })
    // const activeImage = imageField.value

    // WATCH THE DYNAMIC TYPE CHANGES
    const currentBannerType = watch('type')

    // FETCH REAL SYSTEM RESTAURANTS (Cached via React Query automatically)
    // Pass high pageSize limits to get all registered properties choices
    const { data: restaurantsResponse } = useGetRestaurantList()
    /*
    {
        pageIndex: 1,
        pageSize: 200,
        query: '',
    }
    */

    const restaurantOptions =
        restaurantsResponse?.data
            ?.filter((r: Restaurant) => r.profile)
            .map((r: Restaurant) => {
                return {
                    value: r.profile.id,
                    label: r.name,
                }
            }) || []

    console.log('Restaurant options: ', restaurantOptions)

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    useEffect(() => {
        if (isNew) setValue('linkToRestaurant', '')
    }, [currentBannerType, isNew, setValue])

    // 2. Safe preview helper matching local blob strings vs production S3 URLs cleanly
    const getPreviewUrl = (img: any) => {
        if (!img) return ''
        if (img instanceof File) return URL.createObjectURL(img)
        return typeof img === 'string' ? img : img?.url
    }

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {isNew ? 'Add New Banner' : 'Edit Banner'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Banner Details</h4>
                            <div className="space-y-4">
                                {/* 3. Binary File Upload Dropzone */}
                                <FormItem
                                    label="Promotional Media Banner"
                                    invalid={!!errors.image}
                                    errorMessage={errors.image?.message}
                                >
                                    {(() => {
                                        // 1. Initialize local modal state for the cropper workflow
                                        const [modalState, setModalState] =
                                            useState<{
                                                isOpen: boolean
                                                src: string | null
                                            }>({
                                                isOpen: false,
                                                src: null,
                                            })

                                        const activeImage = imageField.value
                                        const previewUrl = activeImage
                                            ? getPreviewUrl(activeImage)
                                            : ''

                                        const originalFileRef = useRef<File | null>(null)

                                        const handleBannerSelect = (
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            // 2. Enforce explicit validation constraints (Max 5MB)
                                            const ALLOWED_TYPES = [
                                                'image/jpeg',
                                                'image/png',
                                                'image/webp',
                                            ]
                                            const MAX_SIZE = 5 * 1024 * 1024

                                            if (
                                                !ALLOWED_TYPES.includes(
                                                    file.type,
                                                )
                                            ) {
                                                toast.push(
                                                    <Notification
                                                        title="Unsupported File"
                                                        type="warning"
                                                    >
                                                        File &quot;
                                                        {file.name}&quot; is not
                                                        supported. Please upload
                                                        JPG, PNG, or WEBP.
                                                    </Notification>,
                                                    {
                                                        placement: 'top-center',
                                                    },
                                                )
                                                e.target.value = ''
                                                return
                                            }

                                            if (file.size > MAX_SIZE) {
                                                toast.push(
                                                    <Notification
                                                        title="Unsupported File"
                                                        type="warning"
                                                    >
                                                        File &quot;
                                                        {file.name}&quot; is not
                                                        supported. Please upload
                                                        JPG, PNG, or WEBP.
                                                    </Notification>,
                                                    {
                                                        placement: 'top-center',
                                                    },
                                                )
                                                e.target.value = ''
                                                return
                                            }

                                            // 3. Save original file for "Use Full Image" option
                                            originalFileRef.current = file

                                            // 4. Process the file to display inside the crop canvas
                                            const reader = new FileReader()
                                            reader.addEventListener(
                                                'load',
                                                () => {
                                                    setModalState({
                                                        isOpen: true,
                                                        src: reader.result as
                                                            | string
                                                            | null,
                                                    })
                                                },
                                            )
                                            reader.readAsDataURL(file)

                                            // Reset the native input target string path
                                            e.target.value = ''
                                        }

                                        return (
                                            <div className="space-y-4">
                                                <div
                                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                'bannerFileInput',
                                                            )
                                                            ?.click()
                                                    }
                                                >
                                                    <input
                                                        id="bannerFileInput"
                                                        type="file"
                                                        className="hidden"
                                                        // Restrict desktop picker explorer screen views
                                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                                        onChange={
                                                            handleBannerSelect
                                                        }
                                                    />
                                                    <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Click to select banner
                                                        promotional image
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Supports JPG, PNG, WEBP
                                                        (Max 5MB)
                                                    </p>
                                                </div>

                                                {activeImage && previewUrl && (
                                                    <div className="mt-4 rounded-xl overflow-hidden border dark:border-gray-800 shadow-sm max-w-xl mx-auto">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Promotional banner preview"
                                                            className="w-full h-50 object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <CropModal
                                                    isOpen={modalState.isOpen}
                                                    imageSrc={
                                                        modalState.src || ''
                                                    }
                                                    aspect={16 / 9}
                                                    originalFile={
                                                        originalFileRef.current
                                                    }
                                                    onClose={() =>
                                                        setModalState({
                                                            isOpen: false,
                                                            src: null,
                                                        })
                                                    }
                                                    onCropComplete={(
                                                        croppedFile: File,
                                                    ) => {
                                                        // Safe clean up handling for local object blob urls if applicable
                                                        if (
                                                            activeImage instanceof
                                                            File
                                                        ) {
                                                            URL.revokeObjectURL(
                                                                previewUrl,
                                                            )
                                                        }
                                                        // Fire mutation state updates up into React Hook Form
                                                        imageField.onChange(
                                                            croppedFile,
                                                        )
                                                        setModalState({
                                                            isOpen: false,
                                                            src: null,
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )
                                    })()}

                                    {/* <div className="space-y-4">
                                        <div
                                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        'bannerFileInput',
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            <input
                                                id="bannerFileInput"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0]
                                                    if (file)
                                                        imageField.onChange(
                                                            file,
                                                        )
                                                }}
                                            />
                                            <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Click to select banner
                                                promotional image
                                            </p>
                                        </div>

                                        //  Live Preview Display Card Item Container *
                                        {activeImage && (
                                            <div className="mt-4 rounded-xl overflow-hidden border dark:border-gray-800 shadow-sm max-w-xl mx-auto">
                                                <img
                                                    src={getPreviewUrl(
                                                        activeImage,
                                                    )}
                                                    alt="Promotional banner preview"
                                                    className="w-full h-40 object-cover"
                                                />
                                            </div>


                                        )}
                                    </div> */}
                                </FormItem>

                                <Controller
                                    name="linkToRestaurant"
                                    control={control}
                                    render={({ field }) => {
                                        if (currentBannerType === 'in_app') {
                                            return (
                                                <FormItem
                                                    label="Select a restaurant"
                                                    invalid={
                                                        !!errors.linkToRestaurant
                                                    }
                                                    errorMessage={
                                                        errors.linkToRestaurant
                                                            ?.message
                                                    }
                                                >
                                                    <Select
                                                        options={
                                                            restaurantOptions
                                                        }
                                                        value={restaurantOptions.find(
                                                            (opt) =>
                                                                opt.value ===
                                                                field.value,
                                                        )}
                                                        placeholder="Search and select restaurant profile..."
                                                        onChange={(opt) =>
                                                            field.onChange(
                                                                opt?.value,
                                                            )
                                                        }
                                                    />
                                                </FormItem>
                                            )
                                        }

                                        return (
                                            <FormItem
                                                label="External Campaign Web Link"
                                                invalid={
                                                    !!errors.linkToRestaurant
                                                }
                                                errorMessage={
                                                    errors.linkToRestaurant
                                                        ?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="External Website Url: https://www.google.com/"
                                                />
                                            </FormItem>
                                        )
                                    }}
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
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) => {
                                                    field.onChange(opt?.value)
                                                    setValue(
                                                        'linkToRestaurant',
                                                        '',
                                                        {
                                                            shouldValidate: false, // Prevents instant validation errors on swap
                                                            shouldDirty: true,
                                                        },
                                                    )
                                                }}
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

export default BannerForm
