import React, { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import BasicInfoSection from './BasicInfoSection'
import PricingSection from './PricingSection'
import LocationSection from './LocationSection'
// import ImageSection from './ImageSection'
// import StaffSection from './StaffSection'
import {
    RestaurantFormInput,
    RestaurantFormOutput,
    restaurantValidationSchema,
    type RestaurantFormSchema,
} from '@/@types/restaurant.type'
import { Card, Notification, toast } from '@/components/ui'
import CropModal from '@/components/shared/ImageCrop/CropModel'
import { removeItem } from 'framer-motion'

import { TbTrash, TbUpload } from 'react-icons/tb'

interface RestaurantFormProps {
    onFormSubmit: (values: RestaurantFormOutput) => void
    defaultValues?: RestaurantFormInput
    isNew?: boolean
    useMockStaff?: boolean
    children?: React.ReactNode
}

const RestaurantForm = (props: RestaurantFormProps) => {
    const {
        onFormSubmit,
        defaultValues,
        children,
        isNew = false,
        // useMockStaff = true,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        getValues,
        setValue,
    } = useForm<RestaurantFormInput, any, RestaurantFormOutput>({
        defaultValues: defaultValues || {
            name: '',
            address: '',
            tax: 0,
            startingPrice: 0,
            endingPrice: 0,
            logoImage: '',
            images: [],
            staffIds: [],
            deletedImageKeys: [],
        },
        resolver: zodResolver(restaurantValidationSchema),
    })

    // Reset form when defaultValues changes
    // const dependencyArray = [JSON.stringify(defaultValues)]
    useEffect(() => {
        if (defaultValues && isNew === false) reset(defaultValues)
        // if (!isEmpty(defaultValues)) {
        //     reset(defaultValues)
        // }
    }, [isNew, reset, defaultValues])

    const onSubmit = (values: RestaurantFormSchema) => {
        onFormSubmit(values)
    }

    // image preview helper for the ImageSection component
    const [detailQueue, setDetailQueue] = useState<
        { file: File; src: string }[]
    >([])

    const getImagePreview = (
        value: File | { key: string; url: string } | string,
    ) => {
        if (!value) return ''
        if (value instanceof File) return URL.createObjectURL(value)
        if (typeof value === 'string') return value
        return value.url // since it's an object with key and url
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                {/* Header with buttons */}
                <div className="flex items-center justify-between mb-6">
                    {children}
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                        <BasicInfoSection
                            control={control}
                            errors={errors}
                            isNew={isNew}
                        />
                        <PricingSection
                            control={control}
                            errors={errors}
                            getValues={getValues}
                        />
                        <LocationSection
                            control={control}
                            errors={errors}
                            isNew={isNew}
                            setValue={setValue}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-110 flex flex-col gap-6">
                        <Card>
                            <h4 className="mb-4">Logo Image</h4>
                            <Controller
                                name="logoImage"
                                control={control}
                                render={({ field }) => {
                                    const [modalState, setModalState] =
                                        useState<{
                                            isOpen: boolean
                                            src: string | null
                                        }>({
                                            isOpen: false,
                                            src: null,
                                        })
                                    console.log('Field.value: ', field.value)
                                    const previewUrl = getImagePreview(
                                        field.value || '',
                                    )
                                    const handleFileSelect = (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const file = e.target.files?.[0]

                                        if (!file) return

                                        // 1. Define logo rules (JPG, PNG, WEBP & Max 5MB)
                                        const ALLOWED_TYPES = [
                                            'image/jpeg',
                                            'image/png',
                                            'image/webp',
                                        ]
                                        const MAX_SIZE = 5 * 1024 * 1024

                                        // 2. Run validations
                                        if (
                                            !ALLOWED_TYPES.includes(file.type)
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
                                            e.target.value = '' // Clear input history path
                                            return
                                        }

                                        if (file.size > MAX_SIZE) {
                                            toast.push(
                                                <Notification
                                                    title="Unsupported File Size"
                                                    type="warning"
                                                >
                                                    File &quot;
                                                    {file.name}&quot; exceeds
                                                    the 5MB size limit..
                                                </Notification>,
                                                {
                                                    placement: 'top-center',
                                                },
                                            )
                                            e.target.value = '' // Clear input history path
                                            return
                                        }
                                        // if (file) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', () =>
                                            setModalState({
                                                isOpen: true,
                                                src: reader.result as
                                                    | string
                                                    | null,
                                            }),
                                        )
                                        reader.readAsDataURL(file)
                                        // }
                                        e.target.value = ''
                                    }

                                    return (
                                        <FormItem
                                            label="Logo Image Url"
                                            invalid={!!errors.logoImage}
                                            errorMessage={
                                                errors.logoImage?.message as
                                                    | string
                                                    | undefined
                                            }
                                        >
                                            <div
                                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                                // className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'logoInput',
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                <input
                                                    id="logoInput"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                />
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="logo image"
                                                        className="h-40 w-full object-cover md:object-contain rounded"
                                                    />
                                                ) : (
                                                    <>
                                                        <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                            Click to select
                                                            article images
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Supports JPG, PNG,
                                                            WEBP (Max 5MB)
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            <CropModal
                                                isOpen={modalState.isOpen}
                                                imageSrc={modalState.src || ''}
                                                aspect={1 / 1}
                                                onClose={() =>
                                                    setModalState({
                                                        isOpen: false,
                                                        src: null,
                                                    })
                                                }
                                                onCropComplete={(
                                                    croppedFile: File,
                                                ) => {
                                                    if (
                                                        field.value instanceof
                                                        File
                                                    ) {
                                                        URL.revokeObjectURL(
                                                            previewUrl,
                                                        )
                                                    }
                                                    field.onChange(croppedFile)
                                                }}
                                            />
                                        </FormItem>
                                    )
                                }}
                            />
                        </Card>

                        <Card>
                            <h4 className="mb-4">Restaurant Images (Max 5)</h4>
                            <Controller
                                name="images"
                                control={control}
                                render={({ field }) => {
                                    const currentImages = field.value || []

                                    const activeQueueItem =
                                        detailQueue[0] || null

                                    const handleFileChange = (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const selectedFiles: File[] =
                                            Array.from(e.target.files || [])

                                        if (selectedFiles.length === 0) return

                                        // 1. Define allowed types and max size (5MB = 5 * 1024 * 1024 bytes)
                                        const ALLOWED_TYPES = [
                                            'image/jpeg',
                                            'image/png',
                                            'image/webp',
                                        ]
                                        const MAX_SIZE = 5 * 1024 * 1024

                                        const validFiles = selectedFiles.filter(
                                            (file) => {
                                                const isValidType =
                                                    ALLOWED_TYPES.includes(
                                                        file.type,
                                                    )
                                                const isValidSize =
                                                    file.size <= MAX_SIZE

                                                if (!isValidType) {
                                                    toast.push(
                                                        <Notification
                                                            title="Unsupported File"
                                                            type="warning"
                                                        >
                                                            File &quot;
                                                            {file.name}&quot; is
                                                            not supported.
                                                            Please upload JPG,
                                                            PNG, or WEBP.
                                                        </Notification>,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        },
                                                    )
                                                } else if (!isValidSize) {
                                                    toast.push(
                                                        <Notification
                                                            title="Unsupported File"
                                                            type="warning"
                                                        >
                                                            File &quot;
                                                            {file.name}&quot;
                                                            exceeds the 5MB size
                                                            limit..
                                                        </Notification>,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        },
                                                    )
                                                }

                                                return (
                                                    isValidType && isValidSize
                                                )
                                            },
                                        )

                                        // 3. Stop execution if no valid files remain
                                        if (validFiles.length === 0) {
                                            e.target.value = '' // Clear input
                                            return
                                        }

                                        const incomingQueue: {
                                            file: File
                                            src: string
                                        }[] = []
                                        let loadedCount = 0

                                        // 4. Process only the valid files (selectedFiles initially)
                                        validFiles.forEach((file: File) => {
                                            const reader = new FileReader()
                                            reader.addEventListener(
                                                'load',
                                                () => {
                                                    incomingQueue.push({
                                                        file,
                                                        src: reader.result as string,
                                                    })
                                                    loadedCount++

                                                    if (
                                                        loadedCount ===
                                                        selectedFiles.length
                                                    ) {
                                                        setDetailQueue(
                                                            (prev) => [
                                                                ...prev,
                                                                ...incomingQueue,
                                                            ],
                                                        )
                                                    }
                                                },
                                            )
                                            reader.readAsDataURL(file)
                                        })
                                        // clear native input event target history path to allow re-uploading the same file twice
                                        e.target.value = ''
                                    }

                                    // {
                                    //     /*

                                    const handleRemoveImage = (
                                        indexToRemove: number,
                                    ) => {
                                        const removedItem =
                                            currentImages[indexToRemove]
                                        const nextImages = currentImages.filter(
                                            (_, idx) => idx !== indexToRemove,
                                        )
                                        field.onChange(nextImages)

                                        if (removedItem instanceof File) {
                                            URL.revokeObjectURL(
                                                getImagePreview(removedItem),
                                            )
                                        }

                                        if (
                                            !(removeItem instanceof File) &&
                                            'key' in removedItem &&
                                            removedItem.key
                                        ) {
                                            const currentDeleted =
                                                getValues('deletedImageKeys') ||
                                                []
                                            setValue('deletedImageKeys', [
                                                ...currentDeleted,
                                                removedItem.key,
                                            ])
                                        }
                                    }
                                    //       */
                                    // }

                                    const handleCropComplete = (
                                        croppedFile: File,
                                    ) => {
                                        const updatedImages = [
                                            ...currentImages,
                                            croppedFile,
                                        ].slice(0, 5)
                                        field.onChange(updatedImages)

                                        setDetailQueue((prev) => prev.slice(1))
                                    }

                                    return (
                                        <FormItem
                                            label="Restaurant Images "
                                            invalid={!!errors.images}
                                            errorMessage={
                                                errors.images?.message
                                            }
                                        >
                                            <div
                                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'restaurantImages',
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                <input
                                                    hidden
                                                    id="restaurantImages"
                                                    // multiple
                                                    type="file"
                                                    onChange={handleFileChange}
                                                />
                                                <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    Click to select article
                                                    images
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Supports JPG, PNG, WEBP (Max
                                                    5MB)
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                {currentImages.map((img, i) => {
                                                    const previewUrl =
                                                        getImagePreview(img)

                                                    return (
                                                        <div
                                                            key={i}
                                                            className="relative group"
                                                        >
                                                            <img
                                                                src={previewUrl}
                                                                className="h-30 w-full object-cover rounded"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() =>
                                                                    handleRemoveImage(
                                                                        i,
                                                                    )
                                                                }
                                                            >
                                                                <TbTrash
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <CropModal
                                                isOpen={!!activeQueueItem}
                                                imageSrc={activeQueueItem?.src}
                                                aspect={1 / 1}
                                                onClose={() =>
                                                    setDetailQueue((prev) =>
                                                        prev.slice(1),
                                                    )
                                                }
                                                onCropComplete={
                                                    handleCropComplete
                                                }
                                            />
                                        </FormItem>
                                    )
                                }}
                            />
                        </Card>
                        {/* <ImageSection
                            control={control}
                            errors={errors}
                            hideSearch={true}
                            getValues={getValues}
                            setValue={setValue}
                        /> */}
                        {/* <StaffSection
                            control={control}
                            errors={errors}
                            useMockData={useMockStaff}
                        /> */}
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default RestaurantForm
