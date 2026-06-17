import { useEffect } from 'react'
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
import {
    useGetRestaurantList,
    useGetRestaurants,
} from '@/utils/custom-hooks/useRestaurant'
import { Restaurant } from '@/@types/restaurant'

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
    const activeImage = imageField.value

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
        restaurantsResponse?.data?.map((r: Restaurant) => {
            console.log('Mapped restaurant: ', r)
            return {
                value: r.profile ? r.profile.id : r.id, // 🔑 The hidden UUID sent to the server
                label: r.name, // 👁️ The human-readable name shown in UI
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

                                        {/* Live Preview Display Card Item Container */}
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
                                    </div>
                                </FormItem>

                                <Controller
                                    name="linkToRestaurant"
                                    control={control}
                                    render={({ field }) => {
                                        if (currentBannerType === 'in_app') {
                                            return (
                                                <FormItem>
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
                                                label="Linked Target Restaurant ID"
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

export default BannerForm
