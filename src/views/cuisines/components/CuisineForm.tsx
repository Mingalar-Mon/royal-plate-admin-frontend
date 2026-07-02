import { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import Textarea from '@/components/ui/Input/Input'
import { CuisineFormData, cuisineValidationSchema } from '../types/cuisine.type'
import { TbUpload } from 'react-icons/tb'
import CropModal from '@/components/shared/ImageCrop/CropModel'
import { Notification, toast } from '@/components/ui'

interface CuisineFormProps {
    onFormSubmit: (data: CuisineFormData) => void
    defaultValues?: Partial<CuisineFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const CuisineForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: CuisineFormProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        // watch,
    } = useForm<CuisineFormData>({
        defaultValues: defaultValues || {
            name: '',
            image: '',
            description: '',
        },
        resolver: zodResolver(cuisineValidationSchema),
    })

    // const { field: imageField } = useController({ name: 'image', control })
    // const activeImage = imageField.value

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    // const imageUrl = watch('image')

    const getPreviewUrl = (img: any) => {
        if (!img) return ''
        if (img instanceof File) return URL.createObjectURL(img)
        return typeof img === 'string' ? img : img?.url
    }

    const onSubmit = (data: CuisineFormData) => onFormSubmit(data)

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">
                        {isNew ? 'Add New Cuisine' : 'Edit Cuisine'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Cuisine Information</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Name"
                                            invalid={!!errors.name}
                                            errorMessage={errors.name?.message}
                                        >
                                            <Input
                                                {...field}
                                                placeholder="e.g., Italian, Japanese"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Description (Optional)">
                                            <Textarea
                                                textArea
                                                {...field}
                                                rows={3}
                                                placeholder="Describe this cuisine..."
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="lg:w-95 space-y-6">
                        <Card>
                            <h4 className="mb-4">Cuisine Image</h4>
                            <Controller
                                name="image"
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

                                    const activeImage = field.value
                                    const previewUrl = activeImage
                                        ? getPreviewUrl(activeImage)
                                        : ''

                                    const handleCuisineSelect = (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return

                                        // 2. Validate formats and size constraints (Max 5MB)
                                        const ALLOWED_TYPES = [
                                            'image/jpeg',
                                            'image/png',
                                            'image/webp',
                                        ]
                                        const MAX_SIZE = 5 * 1024 * 1024

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
                                            e.target.value = ''
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
                                            e.target.value = ''
                                            return
                                        }

                                        // 3. Process valid file payload to launch inside crop interface
                                        const reader = new FileReader()
                                        reader.addEventListener('load', () => {
                                            setModalState({
                                                isOpen: true,
                                                src: reader.result as
                                                    | string
                                                    | null,
                                            })
                                        })
                                        reader.readAsDataURL(file)

                                        // Reset input target path string history logs
                                        e.target.value = ''
                                    }
                                    return (
                                        <FormItem
                                            invalid={!!errors.image}
                                            errorMessage={errors.image?.message}
                                        >
                                            <div className="space-y-4">
                                                {/* Binary File Upload Box Dropzone */}
                                                <div
                                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                'cuisineFileInput',
                                                            )
                                                            ?.click()
                                                    }
                                                >
                                                    <input
                                                        id="cuisineFileInput"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={
                                                            handleCuisineSelect
                                                            //     (e) => {
                                                            //     const file =
                                                            //         e.target
                                                            //             .files?.[0]
                                                            //     if (file)
                                                            //         imageField.onChange(
                                                            //             file,
                                                            //         )
                                                            // }
                                                        }
                                                    />
                                                    <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Click to select cuisine
                                                        image
                                                    </p>
                                                </div>

                                                {/* Live Thumbnail Frame Display */}
                                                {activeImage && previewUrl && (
                                                    <div className="mt-4 rounded-xl overflow-hidden border dark:border-gray-800 shadow-sm">
                                                        <img
                                                            src={getPreviewUrl(
                                                                activeImage,
                                                            )}
                                                            alt="Cuisine thumbnail preview"
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <CropModal
                                                    isOpen={modalState.isOpen}
                                                    imageSrc={
                                                        modalState.src || ''
                                                    }
                                                    aspect={1 / 1} // Ideal card composition structure for e-commerce dish layout assets
                                                    onClose={() =>
                                                        setModalState({
                                                            isOpen: false,
                                                            src: null,
                                                        })
                                                    }
                                                    onCropComplete={(
                                                        croppedFile: File,
                                                    ) => {
                                                        // Safe cleaning pipeline to delete previous garbage memory references
                                                        if (
                                                            activeImage instanceof
                                                            File
                                                        ) {
                                                            URL.revokeObjectURL(
                                                                previewUrl,
                                                            )
                                                        }
                                                        // Correctly map value updates back using RHF 'field' prop token
                                                        field.onChange(
                                                            croppedFile,
                                                        )
                                                        setModalState({
                                                            isOpen: false,
                                                            src: null,
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </FormItem>
                                        // <FormItem
                                        //     label="Image URL"
                                        //     invalid={!!errors.image}
                                        //     errorMessage={errors.image?.message}
                                        // >
                                        //     <Input
                                        //         {...field}
                                        //         placeholder="https://..."
                                        //     />
                                        //     {imageUrl && (
                                        //         <div className="mt-2">
                                        //             <img
                                        //                 src={imageUrl}
                                        //                 alt="Preview"
                                        //                 className="w-full h-32 object-cover rounded-lg"
                                        //             />
                                        //         </div>
                                        //     )}
                                        // </FormItem>
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

export default CuisineForm
