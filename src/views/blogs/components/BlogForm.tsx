import { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import Select from '@/components/ui/Select'

import RichTextEditor from '@/components/shared/RichTextEditor' // your existing rich text editor
import { TbTrash, TbUpload } from 'react-icons/tb'
import {
    BlogFormData,
    BlogFormInput,
    BlogFormOutput,
    blogValidationSchema,
} from '../types/blog.type'
import CropModal from '@/components/shared/ImageCrop/CropModel'
import { Notification, toast } from '@/components/ui'

interface BlogFormProps {
    onFormSubmit: (data: any) => void
    defaultValues?: Partial<BlogFormData>
    isNew?: boolean
    children?: React.ReactNode
    availableAuthors?: {
        value: string
        label: string
        type: 'owner' | 'staff'
    }[]
    availableDishes?: { value: string; label: string }[]
}

const BlogForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
    // availableAuthors = [],
    availableDishes = [],
}: BlogFormProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        getValues,
        setValue,
    } = useForm<BlogFormInput, any, BlogFormOutput>({
        defaultValues: defaultValues || {
            title: '',
            content: '',
            imageUrls: [],

            linkedDishId: '',
            deletedImageKeys: [],
        },
        resolver: zodResolver(blogValidationSchema),
    })
    const [modalState, setModalState] = useState<{
        isOpen: boolean
        src: string | null
    }>({
        isOpen: false,
        src: null,
    })

    // Core single source of truth field tracking using useController
    const { field: imageField } = useController({ name: 'imageUrls', control })
    const activeImages = imageField.value || []

    // const currentAuthorType = watch('authorType')

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    // Safe Preview generator tracking local blobs or production cloud URLs safely
    const getPreviewUrl = (image: any) => {
        if (image instanceof File) return URL.createObjectURL(image)
        return typeof image === 'string' ? image : image?.url
    }

    // FIXED TYPE-SAFE IMAGE DELETION METHOD
    const handleRemoveImage = (index: number) => {
        const newValue = [...activeImages]
        const [removedItem] = newValue.splice(index, 1)
        imageField.onChange(newValue)

        // Verify if item is a real object containing an S3 reference key safely
        if (
            removedItem &&
            !(removedItem instanceof File) &&
            typeof removedItem === 'object' &&
            'key' in removedItem
        ) {
            const currentDeleted = getValues('deletedImageKeys') || []
            setValue('deletedImageKeys', [...currentDeleted, removedItem.key])
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] // Get only the first file
        if (!file) return

        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
        const MAX_SIZE = 5 * 1024 * 1024 // 5MB

        // Verify slot limit
        if (activeImages.length >= 5) {
            alert(
                'Maximum limit of 5 images reached. Please remove an image first.',
            )
            e.target.value = ''
            return
        }

        // Validate type and size constraints
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.push(
                <Notification title="Unsupported File" type="warning">
                    File &quot;
                    {file.name}&quot; is not supported. Please upload JPG, PNG,
                    or WEBP.
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
                <Notification title="Unsupported File Size" type="warning">
                    File &quot;
                    {file.name}&quot; exceeds the 5MB size limit..
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            e.target.value = ''
            return
        }

        // Process file for the crop display view
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setModalState({
                isOpen: true,
                src: reader.result as string | null,
            })
        })
        reader.readAsDataURL(file)

        // Clear target so the same image can be re-selected if removed
        e.target.value = ''
    }

    // Debug tool tip: Logs hidden validation blocks if submission gets intercepted again
    if (Object.keys(errors).length > 0) {
        console.log('Validation failures block intercepted submission:', errors)
    }

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">
                        {isNew ? 'Create New Post' : 'Edit Post'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Post Content</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Title"
                                            invalid={!!errors.title}
                                            errorMessage={errors.title?.message}
                                        >
                                            <Input
                                                {...field}
                                                placeholder="Enter blog title"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Content (Markdown / Rich Text)"
                                            invalid={!!errors.content}
                                            errorMessage={
                                                errors.content?.message
                                            }
                                        >
                                            <RichTextEditor
                                                content={field.value}
                                                height={400}
                                                onChange={(editorOutput: {
                                                    text: string
                                                    html: string
                                                    json: any
                                                }) => {
                                                    field.onChange(
                                                        editorOutput.html,
                                                    )
                                                }}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="lg:w-95 space-y-6">
                        <Card>
                            <h4 className="mb-4">
                                Slider Images ({activeImages.length}/5)
                            </h4>
                            <FormItem
                                invalid={!!errors.imageUrls}
                                errorMessage={errors.imageUrls?.message}
                            >
                                <div className="space-y-4">
                                    {/* Binary File Loader Dropzone */}
                                    <div
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                        onClick={() =>
                                            document
                                                .getElementById('blogFileInput')
                                                ?.click()
                                        }
                                    >
                                        <input
                                            multiple
                                            id="blogFileInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={
                                                handleFileSelect
                                                //     (e) => {
                                                //     const selectedFiles =
                                                //         Array.from(
                                                //             e.target.files || [],
                                                //         )
                                                //     imageField.onChange(
                                                //         [
                                                //             ...activeImages,
                                                //             ...selectedFiles,
                                                //         ].slice(0, 5),
                                                //     )
                                                // }
                                            }
                                        />
                                        <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Click to select article images
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Supports JPG, PNG, WEBP (Max 5MB)
                                        </p>
                                    </div>

                                    {/* Layout Preview Matrix Item Grid with Overlays */}
                                    {activeImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {activeImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group rounded-lg overflow-hidden border dark:border-gray-800 shadow-sm"
                                                >
                                                    <img
                                                        src={getPreviewUrl(img)}
                                                        alt="Article thumbnail"
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <TbTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                        onCropComplete={(croppedFile: File) => {
                                            // Safely append single file to form array up to 5 items max
                                            const updatedList = [
                                                ...activeImages,
                                                croppedFile,
                                            ].slice(0, 5)
                                            imageField.onChange(updatedList)
                                            setModalState({
                                                isOpen: false,
                                                src: null,
                                            })
                                        }}
                                    />
                                </div>
                            </FormItem>
                        </Card>

                        <Card>
                            <h4 className="mb-4">Menu Connection</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="linkedDishId"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Linked Dish (Optional)">
                                            <Select
                                                options={availableDishes}
                                                value={availableDishes.find(
                                                    (d) =>
                                                        d.value === field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
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

export default BlogForm
