import { useCallback, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Controller, useController } from 'react-hook-form'
import { TbPlus, TbTrash, TbPhoto, TbZoom, TbUpload } from 'react-icons/tb'
import type { Control, FieldErrors } from 'react-hook-form'
// import type { RestaurantFormSchema } from '../../CreateRestaurant/types/restaurantForm.types'
import { Input } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useDropzone } from 'react-dropzone'
import { RestaurantFormInput } from '../types/restaurantForm.types'
// import { preview } from 'vite'
// import Control from 'react-select/dist/declarations/src/components/Control'

interface ImageSectionProps {
    control: Control<RestaurantFormInput>
    errors: FieldErrors
    hideSearch: boolean
    getValues: any
    setValue: any
}

const ImageSection = ({
    control,
    errors,
}: Pick<ImageSectionProps, 'control' | 'errors'>) => {
    const [imageUrlInput, setImageUrlInput] = useState('')
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [initialSlide, setInitialSlide] = useState(0)

    // helper to get preview url
    const getPreviewUrl = (image: { key: string; url: string } | File) => {
        if (image instanceof File) return URL.createObjectURL(image)
        return typeof image === 'string' ? image : (image as any).url
    }

    // 1. get the field helpers directly
    const { field } = useController({ name: 'images', control })

    // 2. Watch the images array so it's available everywhere in this file
    const imageUrls = field.value || []

    // unified delete logic
    const removeImage = (index: number) => {
        const newImages = [...imageUrls]
        newImages.splice(index, 1)
        field.onChange(newImages)
        if (newImages.length === 0) setLightboxOpen(false)
    }

    return (
        <Card>
            <h4 className="mb-4">Restaurant Images</h4>
            <Controller
                name="images"
                control={control}
                render={({ field }) => {
                    return (
                        <FormItem
                            invalid={!!errors.images}
                            errorMessage={errors.images?.message as string}
                        >
                            <div className="space-y-4">
                                {/* 1. Dropzone - Passes files directly to filed.onChange */}
                                {/* <UploadZone onFil /> */}
                                {/* DROPZONE (Simple version since you don't have a component) */}
                                <div
                                    className="border-2 border-dashed p-4 text-center cursor-pointer"
                                    onClick={() =>
                                        document
                                            .getElementById('fileInput')
                                            ?.click()
                                    }
                                >
                                    <input
                                        multiple
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) =>
                                            field.onChange([
                                                ...imageUrls,
                                                ...Array.from(
                                                    e.target.files || [],
                                                ),
                                            ])
                                        }
                                    />
                                    <p>Click or drag to upload images</p>
                                </div>

                                {/* 2.  Image Grid with +N Overlay */}
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {imageUrls
                                            .slice(0, 4)
                                            .map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group cursor-pointer overflow-hidden rounded-lg border dark:border-gray-700"
                                                    onClick={() => {
                                                        setInitialSlide(idx)
                                                        setLightboxOpen(true)
                                                    }}
                                                >
                                                    <img
                                                        src={getPreviewUrl(img)}
                                                        className="w-full h-32 object-cover"
                                                        alt="Preview"
                                                    />

                                                    {/* Delete Button */}
                                                    <button
                                                        className="absolute top-1 right-1 z-20 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removeImage(idx)
                                                        }}
                                                    >
                                                        <TbTrash
                                                            className="text-white"
                                                            size={14}
                                                        />
                                                    </button>

                                                    {/* +N Overlay logic moved here into a single spot */}
                                                    {idx === 3 &&
                                                        imageUrls.length >
                                                            4 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                                                <span className="text-white font-bold">
                                                                    +
                                                                    {imageUrls.length -
                                                                        4}{' '}
                                                                    more
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* 3. Manual URL Input */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add image via URL..."
                                        value={imageUrlInput}
                                        onChange={(e) =>
                                            setImageUrlInput(e.target.value)
                                        }
                                    />
                                    <Button
                                        onClick={() => {
                                            if (imageUrlInput)
                                                field.onChange([
                                                    ...imageUrls,
                                                    imageUrlInput,
                                                ])
                                            setImageUrlInput('')
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </FormItem>
                    )
                }}
            />

            {/* 4. Lightbox using the SAME Unified Delete logic */}
            <Dialog
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                width={800}
            >
                <div className="p-4">
                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => (
                            <Swiper
                                initialSlide={initialSlide}
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination
                            >
                                {(field.value || []).map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <img
                                            src={getPreviewUrl(img)}
                                            className="w-full h-[400px] object-contain"
                                        />
                                        <div className="mt-4 text-center">
                                            <Button
                                                variant="default"
                                                onClick={() => removeImage(idx)}
                                            >
                                                Delete Image
                                            </Button>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    />
                </div>
            </Dialog>
        </Card>
    )
}

// const ImageSection = ({
//     control,
//     errors,
//     hideSearch = false,
//     getValues,
//     setValue,
// }: ImageSectionProps) => {
//     const [imageUrlInput, setImageUrlInput] = useState('')
//     const [lightboxOpen, setLightboxOpen] = useState(false)
//     const [initialSlide, setInitialSlide] = useState(0)
//     // for drag and drop
//     const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
//     const [isDragging, setIsDragging] = useState(false)

//     // Handle drag-and-drop
//     const onDrop = useCallback(
//         (acceptedFiles: File[]) => {
//             const currentImages = getValues('images') || []

//             // field.onChange([...field.value, ...acceptedFiles])
//             setValue('images', [...currentImages, ...acceptedFiles], {
//                 shouldValidate: true,
//             })
//             // Convert files to URLs (in real implementation, you'd upload to server)
//             // const newImageUrls = acceptedFiles.map((file) =>
//             //     URL.createObjectURL(file),
//             // )

//             // In production, you'd upload to your server and get back URLs
//             // For now, we'll use object URLs (they work locally)

//             // You can also use a service like Cloudinary, ImgBB, etc.
//             console.log('Files to upload:', acceptedFiles)

//             // For demo purposes, we'll just add the object URLs
//             // In production, replace with actual upload logic
//             // field.onChange([...imageUrls, ...newImageUrls])
//         },
//         [getValues, setValue],
//     )

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: {
//             'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
//         },
//         maxSize: 5 * 1024 * 1024, // 5MB
//     })

//     const handleOpenLightbox = (index: number) => {
//         setInitialSlide(index)
//         setLightboxOpen(true)
//     }

//     const handleImageError = (index: number) => {
//         setFailedImages((prev) => new Set(prev).add(index))
//     }

//     return (
//         <>
//             <Card>
//                 <h4 className="mb-4">Restaurant Images</h4>
//                 <Controller
//                     name="images"
//                     control={control}
//                     render={({ field }) => {
//                         // ✅ Ensure field.value is always an array
//                         const imageUrls = field.value || []

//                         return (
//                             <FormItem
//                                 invalid={!!errors.imageUrls}
//                                 errorMessage={errors.imageUrls?.message}
//                             >
//                                 <div className="space-y-4">
//                                     {/* Drag & Drop Zone */}
//                                     <div
//                                         {...getRootProps()}
//                                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
//                                             ${
//                                                 isDragActive
//                                                     ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
//                                                     : 'border-gray-300 hover:border-primary-400'
//                                             }`}
//                                         onDragEnter={() => setIsDragging(true)}
//                                         onDragLeave={() => setIsDragging(false)}
//                                         onDrop={() => setIsDragging(false)}
//                                     >
//                                         <input {...getInputProps()} />
//                                         <TbUpload className="mx-auto text-3xl text-gray-400 mb-2" />
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                                             {isDragActive
//                                                 ? 'Drop your images here...'
//                                                 : 'Drag & drop images here, or click to select'}
//                                         </p>
//                                         <p className="text-xs text-gray-500 mt-1">
//                                             Supports: JPG, PNG, GIF, WEBP (Max
//                                             5MB)
//                                         </p>
//                                     </div>

//                                     {/* Image Preview Grid - Show max 4 images with overlay */}
//                                     {imageUrls.length > 0 && (
//                                         <div className="grid grid-cols-2 gap-3">
//                                             {imageUrls.slice(0, 4).map(
//                                                 (
//                                                     image:
//                                                         | File
//                                                         | {
//                                                               key: string
//                                                               url: string
//                                                           },
//                                                     index: number,
//                                                 ) => {
//                                                     const previewUrl =
//                                                         image instanceof File
//                                                             ? URL.createObjectURL(
//                                                                   image,
//                                                               )
//                                                             : image.url
//                                                     if (imageUrls.length <= 4) {
//                                                         return (
//                                                             <div
//                                                                 key={index}
//                                                                 className="relative group cursor-pointer"
//                                                                 onClick={() =>
//                                                                     handleOpenLightbox(
//                                                                         index,
//                                                                     )
//                                                                 }
//                                                             >
//                                                                 <img
//                                                                     src={
//                                                                         previewUrl
//                                                                     }
//                                                                     alt={`Restaurant ${
//                                                                         index +
//                                                                         1
//                                                                     }`}
//                                                                     className="w-full h-32 object-cover rounded-lg"
//                                                                 />

//                                                                 {/* Delete button */}
//                                                                 <button
//                                                                     type="button"
//                                                                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
//                                                                     onClick={(
//                                                                         e,
//                                                                     ) => {
//                                                                         e.stopPropagation()
//                                                                         const newUrls =
//                                                                             [
//                                                                                 ...imageUrls,
//                                                                             ]
//                                                                         newUrls.splice(
//                                                                             index,
//                                                                             1,
//                                                                         )
//                                                                         field.onChange(
//                                                                             newUrls,
//                                                                         )
//                                                                         console.log(
//                                                                             '',
//                                                                         )
//                                                                     }}
//                                                                 >
//                                                                     <TbTrash
//                                                                         size={
//                                                                             16
//                                                                         }
//                                                                     />
//                                                                 </button>

//                                                                 {/* View button on hover */}
//                                                                 <div className="absolute inset-0 bg-black/60 opacity-0   group-hover:opacity-100 duration-300  transition-all rounded-lg flex items-center justify-center">
//                                                                     <TbZoom className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl" />
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     }
//                                                     return (
//                                                         <div
//                                                             key={index}
//                                                             className="relative group cursor-pointer"
//                                                             onClick={() =>
//                                                                 handleOpenLightbox(
//                                                                     index,
//                                                                 )
//                                                             }
//                                                         >
//                                                             <img
//                                                                 src={previewUrl}
//                                                                 alt={`Restaurant ${
//                                                                     index + 1
//                                                                 }`}
//                                                                 className="w-full h-32 object-cover rounded-lg"
//                                                             />

//                                                             {/* Delete button */}
//                                                             <button
//                                                                 type="button"
//                                                                 className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
//                                                                 onClick={(
//                                                                     e,
//                                                                 ) => {
//                                                                     e.stopPropagation()
//                                                                     const newUrls =
//                                                                         [
//                                                                             ...imageUrls,
//                                                                         ]
//                                                                     newUrls.splice(
//                                                                         index,
//                                                                         1,
//                                                                     )
//                                                                     field.onChange(
//                                                                         newUrls,
//                                                                     )
//                                                                 }}
//                                                             >
//                                                                 <TbTrash
//                                                                     size={16}
//                                                                 />
//                                                             </button>

//                                                             {/* View button on hover */}
//                                                             {/* <div className="absolute inset-0 bg-black/60 opacity-0   group-hover:opacity-100 duration-300  transition-all rounded-lg flex items-center justify-center">
//                                                                     <TbZoom className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl" />
//                                                                 </div> */}
//                                                             {/* More photos overlay on the 4th image */}
//                                                             {index === 3 &&
//                                                                 imageUrls.length >
//                                                                     4 && (
//                                                                     <div className="absolute inset-0 bg-black/60 bg-opacity-60 rounded-lg flex items-center justify-center">
//                                                                         <span className="text-white font-semibold text-lg">
//                                                                             +
//                                                                             {imageUrls.length -
//                                                                                 4}{' '}
//                                                                             more
//                                                                         </span>
//                                                                     </div>
//                                                                 )}
//                                                         </div>
//                                                     )
//                                                 },
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Add Image URL */}
//                                     <div className="flex gap-2">
//                                         <Input
//                                             value={imageUrlInput}
//                                             onChange={(e) =>
//                                                 setImageUrlInput(e.target.value)
//                                             }
//                                             placeholder="Enter image URL"
//                                             className="flex-1"
//                                             onKeyPress={(e) => {
//                                                 if (
//                                                     e.key === 'Enter' &&
//                                                     imageUrlInput.trim()
//                                                 ) {
//                                                     field.onChange([
//                                                         ...imageUrls,
//                                                         imageUrlInput,
//                                                     ])
//                                                     setImageUrlInput('')
//                                                 }
//                                             }}
//                                         />
//                                         <Button
//                                             type="button"
//                                             icon={<TbPlus />}
//                                             onClick={() => {
//                                                 if (imageUrlInput.trim()) {
//                                                     field.onChange([
//                                                         ...imageUrls,
//                                                         imageUrlInput,
//                                                     ])
//                                                     setImageUrlInput('')
//                                                 }
//                                             }}
//                                         >
//                                             Add
//                                         </Button>
//                                     </div>

//                                     {/* Image count indicator */}
//                                     {imageUrls.length > 0 && (
//                                         <p className="text-xs text-gray-500">
//                                             {imageUrls.length} image
//                                             {imageUrls.length !== 1
//                                                 ? 's'
//                                                 : ''}{' '}
//                                             total
//                                             {imageUrls.length > 4 &&
//                                                 ' (showing first 4)'}
//                                         </p>
//                                     )}

//                                     {/* {imageUrls.length === 0 && (
//                                         <div className="text-center py-8 border-2 border-dashed rounded-lg">
//                                             <TbPhoto className="mx-auto text-4xl text-gray-400" />
//                                             <p className="text-sm text-gray-500 mt-2">
//                                                 No images added yet
//                                             </p>
//                                         </div>
//                                     )} */}
//                                 </div>
//                             </FormItem>
//                         )
//                     }}
//                 />
//             </Card>

//             {/* Lightbox Dialog for viewing all images */}
//             <Dialog
//                 isOpen={lightboxOpen}
//                 onClose={() => setLightboxOpen(false)}
//                 onRequestClose={() => setLightboxOpen(false)}
//                 width={900}
//                 closable={true}
//             >
//                 <div className="p-4">
//                     <Controller
//                         name="imageUrls"
//                         control={control}
//                         render={({ field }) => {
//                             const imageUrls = field.value || []
//                             return (
//                                 <>
//                                     {imageUrls.length > 0 && (
//                                         <Swiper
//                                             modules={[
//                                                 Navigation,
//                                                 Pagination,
//                                                 Keyboard,
//                                             ]}
//                                             navigation={true}
//                                             pagination={{ clickable: true }}
//                                             keyboard={true}
//                                             initialSlide={initialSlide}
//                                             spaceBetween={30}
//                                             slidesPerView={1}
//                                             style={{ height: '500px' }}
//                                         >
//                                             {imageUrls.map((url, index) => (
//                                                 <SwiperSlide key={index}>
//                                                     <div className="flex flex-col h-full">
//                                                         <img
//                                                             src={url}
//                                                             alt={`Restaurant ${index + 1}`}
//                                                             className="w-full h-[400px] object-contain rounded-lg"
//                                                         />
//                                                         <div className="flex justify-between items-center mt-4">
//                                                             <span className="text-sm text-gray-500">
//                                                                 Image{' '}
//                                                                 {index + 1} of{' '}
//                                                                 {
//                                                                     imageUrls.length
//                                                                 }
//                                                             </span>
//                                                             <Button
//                                                                 type="button"
//                                                                 variant="default"
//                                                                 size="sm"
//                                                                 icon={
//                                                                     <TbTrash />
//                                                                 }
//                                                                 className="text-red-500"
//                                                                 onClick={() => {
//                                                                     const newUrls =
//                                                                         [
//                                                                             ...field.value,
//                                                                         ]
//                                                                     newUrls.splice(
//                                                                         index,
//                                                                         1,
//                                                                     )
//                                                                     field.onChange(
//                                                                         newUrls,
//                                                                     )
//                                                                     if (
//                                                                         newUrls.length ===
//                                                                         0
//                                                                     ) {
//                                                                         setLightboxOpen(
//                                                                             false,
//                                                                         )
//                                                                     }
//                                                                 }}
//                                                             >
//                                                                 Delete
//                                                             </Button>
//                                                         </div>
//                                                     </div>
//                                                 </SwiperSlide>
//                                             ))}
//                                         </Swiper>
//                                     )}
//                                 </>
//                             )
//                         }}
//                     />
//                 </div>
//             </Dialog>
//         </>
//     )
// }

export default ImageSection
