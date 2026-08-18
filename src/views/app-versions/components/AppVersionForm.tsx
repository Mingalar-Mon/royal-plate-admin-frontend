import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { appVersionValidationSchema } from '@/@types/appVersion'
import type { AppVersionFormData } from '@/@types/appVersion'

interface AppVersionFormProps {
    onFormSubmit: (data: AppVersionFormData) => void
    defaultValues?: Partial<AppVersionFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const AppVersionForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: AppVersionFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<AppVersionFormData>({
        defaultValues: defaultValues || {
            title: '',
            body: '',
            versionCode: 0,
            versionName: '',
            playStoreLink: '',
            iosLink: '',
            directDownloadLink: '',
        },
        resolver: zodResolver(appVersionValidationSchema),
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {isNew ? 'Add New App Version' : 'Edit App Version'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Version Details</h4>
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
                                                placeholder="e.g., New feature release"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="body"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Body"
                                            invalid={!!errors.body}
                                            errorMessage={errors.body?.message}
                                        >
                                            <Input
                                                textArea
                                                rows={4}
                                                {...field}
                                                placeholder="Describe the changes in this version..."
                                            />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                        name="versionCode"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Version Code"
                                                invalid={!!errors.versionCode}
                                                errorMessage={
                                                    errors.versionCode?.message
                                                }
                                            >
                                                <Input
                                                    type="number"
                                                    value={field.value}
                                                    placeholder="e.g., 1"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? 0
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
                                                    onBlur={field.onBlur}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="versionName"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Version Name"
                                                invalid={!!errors.versionName}
                                                errorMessage={
                                                    errors.versionName?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., 1.0.0"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h4 className="mb-4">Download Links</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="playStoreLink"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Play Store Link"
                                            invalid={!!errors.playStoreLink}
                                            errorMessage={
                                                errors.playStoreLink?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                placeholder="https://play.google.com/store/apps/details?id=..."
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="iosLink"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="iOS Link"
                                            invalid={!!errors.iosLink}
                                            errorMessage={
                                                errors.iosLink?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                placeholder="https://apps.apple.com/app/id..."
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="directDownloadLink"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Direct Download Link"
                                            invalid={
                                                !!errors.directDownloadLink
                                            }
                                            errorMessage={
                                                errors.directDownloadLink
                                                    ?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                placeholder="https://example.com/download/app.apk"
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

export default AppVersionForm
