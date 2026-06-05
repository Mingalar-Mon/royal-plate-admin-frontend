import { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import RichTextEditor from '@/components/shared/RichTextEditor' // your existing rich text editor
import { TbPlus, TbTrash, TbUpload } from 'react-icons/tb'
import { BlogFormData, blogValidationSchema } from '../types/blog.type'

// const blogSchema = z.object({
//     title: z.string().min(1, 'Title is required'),
//     content: z.string().min(1, 'Content is required'),
//     imageUrls: z.array(z.string()).max(5, 'Maximum 5 images').optional(),
//     authorType: z.enum(['owner', 'staff']),
//     authorId: z.string().optional(),
//     linkedDishId: z.string().optional(),
// })

// type BlogFormData = z.infer<typeof blogSchema>

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

const authorTypeOptions = [
    { value: 'owner', label: 'Restaurant Owner' },
    { value: 'staff', label: 'Staff Member' },
]

const BlogForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
    availableAuthors = [],
    availableDishes = [],
}: BlogFormProps) => {
    // const [imageUrls, setImageUrls] = useState<string[]>(
    //     defaultValues?.imageUrls || [],
    // )
    const [newImageUrl, setNewImageUrl] = useState('')

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,

        getValues,
        setValue,
    } = useForm<BlogFormData>({
        defaultValues: defaultValues || {
            title: '',
            content: '',
            imageUrls: [],
            // authorType: 'owner',
            // authorId: '',
            linkedDishId: '',
            deletedImageKeys: [],
        },
        resolver: zodResolver(blogValidationSchema),
    })

    // 1. Core single source of truth field tracking using useController
    const { field: imageField } = useController({ name: 'imageUrls', control })
    const activeImages = imageField.value || []

    // const currentAuthorType = watch('authorType')

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
            // setImageUrls(defaultValues.imageUrls || [])
        }
    }, [defaultValues, reset])

    // Safe Preview generator tracking local blobs or production cloud URLs safely
    const getPreviewUrl = (image: any) => {
        if (image instanceof File) return URL.createObjectURL(image)
        return typeof image === 'string' ? image : image?.url
    }

    // ✅ FIXED TYPE-SAFE IMAGE DELETION METHOD
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

    //  Unified delete handler pushing S3 keys straight into the form data payload map
    // const handleRemoveImage = (index: number) => {
    //     const newValue = [...activeImages]
    //     const [removedItem] = newValue.splice(index, 1)
    //     imageField.onChange(newValue)

    //     // If it's an already saved object tracking keys from the backend, mark it for S3 removal
    //     if (!(removedItem instanceof File) && removedItem?.key) {
    //         const currentDeleted = getValues('deletedImageKeys') || []
    //         setValue('deletedImageKeys', [...currentDeleted, removedItem.key])
    //     }
    // }

    // 2. Clear image array mutations using hook states directly
    // const handleAddImage = () => {
    //     if (newImageUrl.trim() && activeImages.length < 5) {
    //         imageField.onChange([...activeImages, newImageUrl.trim()])
    //         setNewImageUrl('')
    //     }
    // }

    // const handleRemoveImage = (index: number) => {
    //     imageField.onChange(activeImages.filter((_, i) => i !== index))
    // }

    // Filter available authors lists based on the chosen dropdown selector tier
    const dynamicAuthorsList = availableAuthors.filter(
        (a) => a.type === currentAuthorType,
    )

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
                                                // value={field.value}
                                                content={field.value}
                                                height={400}
                                                // ✅ Intercept the composite object event and store ONLY the HTML string string field
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

                    <div className="lg:w-[380px] space-y-6">
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
                                            onChange={(e) => {
                                                const selectedFiles =
                                                    Array.from(
                                                        e.target.files || [],
                                                    )
                                                imageField.onChange(
                                                    [
                                                        ...activeImages,
                                                        ...selectedFiles,
                                                    ].slice(0, 5),
                                                )
                                            }}
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
                                </div>
                            </FormItem>
                        </Card>

                        <Card>
                            <h4 className="mb-4">Menu Connection</h4>
                            <div className="space-y-4">
                                {/* <Controller
                                    name="authorType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Author Type">
                                            <Select
                                                options={[
                                                    {
                                                        value: 'owner',
                                                        label: 'Restaurant Owner',
                                                    },
                                                    {
                                                        value: 'staff',
                                                        label: 'Staff Member',
                                                    },
                                                ]}
                                                value={[
                                                    {
                                                        value: field.value,
                                                        label:
                                                            field.value ===
                                                            'owner'
                                                                ? 'Restaurant Owner'
                                                                : 'Staff Member',
                                                    },
                                                ]}
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                /> */}
                                {/* <Controller
                                    name="authorId"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Select Author">
                                            <Select
                                                options={dynamicAuthorsList}
                                                value={dynamicAuthorsList.find(
                                                    (a) =>
                                                        a.value === field.value,
                                                )}
                                                isDisabled={
                                                    dynamicAuthorsList.length ===
                                                    0
                                                }
                                                placeholder={
                                                    dynamicAuthorsList.length ===
                                                    0
                                                        ? 'No records available'
                                                        : 'Select employee...'
                                                }
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                /> */}
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
