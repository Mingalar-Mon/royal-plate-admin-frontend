// components/DishForm.tsx
import { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import {
    dishValidationSchema,
    // type DishFormData,
    type DishFormInput,
    type DishFormOutput,
} from '@/views/dishes/types/dish.type'

import { TbTrash, TbUpload } from 'react-icons/tb'

import CropModal from '@/components/shared/ImageCrop/CropModel'

interface DishFormProps {
    onFormSubmit: (data: DishFormOutput) => void
    defaultValues?: DishFormInput
    isNew?: boolean
    onImageDelete?: (key: string) => void
    children?: React.ReactNode
    categories: { value: string; label: string }[]
}

const DishForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    categories,
    children,
    // onImageDelete,
}: DishFormProps) => {
    // Fallback default values
    const defaultDishValues: DishFormInput = {
        name: '',
        description: '',
        price: 0,
        category: '',
        coverImage: undefined,
        detailImages: [],
        available: true,
        preparationTime: 30,
        deletedImageKeys: [], // Added to match schema defaults
    }
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        getValues,
        setValue,
    } = useForm<DishFormInput, any, DishFormOutput>({
        defaultValues: defaultValues || defaultDishValues,
        // {
        //     name: '',
        //     description: '',
        //     price: 0,
        //     category: '',
        //     coverImage: undefined,
        //     detailImages: [],
        //     available: true,
        //     preparationTime: 30,
        //     deletedImageKeys: []
        // },
        resolver: zodResolver(dishValidationSchema),
    })

    // Reset form when defaultValues change (for edit)
    useEffect(() => {
        if (defaultValues && isNew === false) reset(defaultValues)
    }, [isNew, reset, defaultValues])

    const onSubmit = (data: DishFormOutput) => onFormSubmit(data)

    const getImagePreview = (value: any) => {
        if (!value) return ''
        if (value instanceof File) return URL.createObjectURL(value)
        if (typeof value === 'string') return value
        return value?.url || ''
    }
    // Custom hook to automatically clean up object URLs and prevent memory leaks
    /*
    const useObjectUrlCleanup = (value: any) => {
        useEffect(() => {
            return () => {
                if (value instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(value))
                } else if (Array.isArray(value)) {
                    value.forEach((img) => {
                        if (img instanceof File) {
                            URL.revokeObjectURL(URL.createObjectURL(img))
                        }
                    })
                }
            }
        }, [value])
    }
        */

    const [detailQueue, setDetailQueue] = useState<
        { file: File; src: string }[]
    >([])

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                {/* Dynamic Heading */}
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">
                        {isNew ? 'Add New Dish' : 'Edit Dish'}
                    </h3>
                </div>

                {/* Custom buttons (Back, Submit, Delete) passed from parent */}
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Left column */}
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Basic Information</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Dish Name"
                                            invalid={!!errors.name}
                                            errorMessage={errors.name?.message}
                                        >
                                            <Input
                                                {...field}
                                                placeholder="e.g., Margherita Pizza"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Description">
                                            <Input
                                                textArea
                                                {...field}
                                                placeholder="Describe the dish..."
                                                rows={3}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="price"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Price (MMK)"
                                                invalid={!!errors.price}
                                                errorMessage={
                                                    errors.price?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    value={field.value}
                                                    type="number"
                                                    placeholder="0"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Category"
                                                invalid={!!errors.category}
                                                errorMessage={
                                                    errors.category?.message
                                                }
                                            >
                                                <Select
                                                    options={categories}
                                                    value={categories.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value,
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="preparationTime"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem label="Preparation Time (minutes)">
                                                <Input
                                                    {...field}
                                                    value={
                                                        (field.value as
                                                            | string
                                                            | number) ?? ''
                                                    }
                                                    type="number"
                                                    placeholder="30"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    {/* <Controller
                                        name="spicyLevel"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem label="Spicy Level">
                                                <Select
                                                    options={spicyOptions}
                                                    value={spicyOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(opt) =>
                                                        field.onChange(
                                                            opt?.value,
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    /> */}
                                </div>
                                <Controller
                                    name="available"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Checkbox
                                                checked={field.value}
                                                onChange={field.onChange}
                                            >
                                                Available for ordering
                                            </Checkbox>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="lg:w-95 space-y-6">
                        <Card>
                            <h4 className="mb-4">Cover Image</h4>
                            <Controller
                                name="coverImage"
                                control={control}
                                render={({ field, fieldState: { error } }) => {
                                    const [modalState, setModalState] =
                                        useState<{
                                            isOpen: boolean
                                            src: string | null
                                        }>({ isOpen: false, src: null })
                                    const previewUrl = getImagePreview(
                                        field.value || '',
                                    )
                                    const handleFileSelect = (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.addEventListener(
                                                'load',
                                                () => {
                                                    setModalState({
                                                        isOpen: true,
                                                        src: reader.result as string,
                                                    })
                                                },
                                            )
                                            reader.readAsDataURL(file)
                                        }
                                    }
                                    return (
                                        <FormItem
                                            label="Image URL"
                                            invalid={!!errors.coverImage}
                                            errorMessage={
                                                errors.coverImage?.message
                                            }
                                        >
                                            <div
                                                className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'coverInput',
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                <input
                                                    id="coverInput"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                    // onChange={(e) =>
                                                    // field.onChange( //
                                                    // e.target.files?.[0], // )
                                                    // }
                                                />
                                                {previewUrl ? (
                                                    <img
                                                        src={
                                                            previewUrl

                                                            // field.value instanceof
                                                            // File
                                                            //     ? URL.createObjectURL(
                                                            //           field.value,
                                                            //       )
                                                            //     : typeof field.value ===
                                                            //         'string'
                                                            //       ? field.value
                                                            //       : field.value.url
                                                            //
                                                        }
                                                        className="h-40 w-full object-cover md:object-contain rounded"
                                                    />
                                                ) : (
                                                    <p>
                                                        Click to upload cover
                                                        image
                                                    </p>
                                                )}
                                            </div>
                                            {error && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {error.message}
                                                </p>
                                            )}
                                            {/* Modal Trigger for Crop */}
                                            <CropModal
                                                isOpen={modalState.isOpen}
                                                imageSrc={
                                                    modalState.src as string
                                                }
                                                aspect={1 / 1} // Facebook Standard Cover Ratio (Use 1 / 1 for Profile Pictures)
                                                onClose={() =>
                                                    setModalState({
                                                        isOpen: false,
                                                        src: null,
                                                    })
                                                }
                                                onCropComplete={(
                                                    croppedFile: File,
                                                ) => {
                                                    console.log(
                                                        'Cropped file:',
                                                        croppedFile,
                                                    )
                                                    console.log(
                                                        typeof croppedFile,
                                                    )
                                                    // Clean up previous ObjectURL memory leaks before passing new data
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
                            <h4 className="mb-4">Detail Images (Max 5)</h4>
                            <Controller
                                name="detailImages"
                                control={control}
                                render={({ field }) => {
                                    const currentImages = field.value || []

                                    // Sequential Processing: Get the active item currently waiting at index 0
                                    console.log('Detail queue: ', detailQueue)
                                    const activeQueueItem =
                                        detailQueue[0] || null

                                    const handleFileChange = (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const selectedFiles: File[] =
                                            Array.from(e.target.files || [])
                                        if (selectedFiles.length === 0) return

                                        const incomingQueue: {
                                            file: File
                                            src: string
                                        }[] = []
                                        let loadedCount = 0

                                        // Convert files to base64 strings so react-easy-crop can render them
                                        selectedFiles.forEach((file: File) => {
                                            const reader = new FileReader()
                                            reader.addEventListener(
                                                'load',
                                                () => {
                                                    incomingQueue.push({
                                                        file,
                                                        src: reader.result as string,
                                                    })
                                                    loadedCount++

                                                    // Once all files are securely parsed, initialize our structural queue state
                                                    if (
                                                        loadedCount ===
                                                        selectedFiles.length
                                                    ) {
                                                        setDetailQueue(
                                                            (prev) => {
                                                                console.log(
                                                                    'Previous Queue: ',
                                                                    prev,
                                                                )
                                                                console.log(
                                                                    'Incoming Queue: ',
                                                                    incomingQueue,
                                                                )
                                                                console.log(
                                                                    'setDetailQueues',
                                                                    [
                                                                        ...prev,
                                                                        ...incomingQueue,
                                                                    ],
                                                                )
                                                                return [
                                                                    ...prev,
                                                                    ...incomingQueue,
                                                                ]
                                                            },
                                                        )
                                                    }
                                                },
                                            )
                                            reader.readAsDataURL(file)
                                        })

                                        // Clear native input event target history path to allow re-uploading same file twice
                                        e.target.value = ''
                                    }

                                    const handleRemoveImage = (
                                        indexToRemove: number,
                                    ) => {
                                        const removedItem =
                                            currentImages[indexToRemove]
                                        const nextImages = currentImages.filter(
                                            (_, idx) => idx !== indexToRemove,
                                        )
                                        field.onChange(nextImages)

                                        // Instant performance garbage collection cleanup invocation
                                        if (removedItem instanceof File) {
                                            URL.revokeObjectURL(
                                                getImagePreview(removedItem),
                                            )
                                        }

                                        // Track deleted remote images for backend S3 bucket cleanup
                                        if (
                                            !(removedItem instanceof File) &&
                                            removedItem?.key
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

                                    const handleCropComplete = (
                                        croppedFile: File,
                                    ) => {
                                        // Enforce the strict upper limit barrier ceiling of 5 elements
                                        const updatedImages = [
                                            ...currentImages,
                                            croppedFile,
                                        ].slice(0, 5)
                                        field.onChange(updatedImages)

                                        // Remove the processed file from our queue array to advance to next frame
                                        setDetailQueue((prev) => prev.slice(1))
                                    }
                                    return (
                                        <FormItem>
                                            <div
                                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'detailInput',
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                <input
                                                    // multiple
                                                    id="detailInput"
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
                                                                className="h-30 w-full object-cover rounded bg-black"
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
                                                aspect={1 / 1} // Facebook Product Details Standard Ratio (Square)
                                                onClose={() =>
                                                    setDetailQueue((prev) =>
                                                        prev.slice(1),
                                                    )
                                                } // Cancel skips item
                                                onCropComplete={
                                                    handleCropComplete
                                                }
                                            />
                                        </FormItem>
                                    )
                                }}
                            />
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default DishForm

/*
removing new image
// onClick={() => {
                                                                    const newValue =
                                                                        [
                                                                            ...(field.value ||
                                                                                []),
                                                                        ]
                                                                    const removedItem =
                                                                        newValue.splice(
                                                                            i,
                                                                            1,
                                                                        )[0]
                                                                    field.onChange(
                                                                        newValue,
                                                                    )

                                                                    // If it wasn't a new file, it has a key we need to delete from S3
                                                                    // if (
                                                                    //     !(
                                                                    //         removedItem instanceof
                                                                    //         File
                                                                    //     ) &&
                                                                    //     removedItem.key
                                                                    // ) {
                                                                    //     // Pass this up to the parent via a prop like 'onImageDelete'
                                                                    //     onImageDelete?.(
                                                                    //         removedItem.key,
                                                                    //     )
                                                                    // }
                                                                    if (
                                                                        !(
                                                                            removedItem instanceof
                                                                            File
                                                                        ) &&
                                                                        removedItem?.key
                                                                    ) {
                                                                        // Use setValue from useForm to update the hidden field
                                                                        const currentDeleted =
                                                                            getValues(
                                                                                'deletedImageKeys',
                                                                            ) ||
                                                                            []
                                                                        setValue(
                                                                            'deletedImageKeys',
                                                                            [
                                                                                ...currentDeleted,
                                                                                removedItem.key,
                                                                            ],
                                                                        )
                                                                    }
                                                                }}
*/
