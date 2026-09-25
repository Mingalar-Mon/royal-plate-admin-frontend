import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { appSettingValidationSchema } from '@/@types/appSetting'
import type { AppSettingFormData, AppSettingType } from '@/@types/appSetting'

const typeOptions: { value: AppSettingType; label: string }[] = [
    { value: 'TEXT', label: 'Text' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'URL', label: 'URL' },
    { value: 'HTML', label: 'HTML (Rich Content)' },
]

interface AppSettingFormProps {
    onFormSubmit: (data: AppSettingFormData) => void
    defaultValues?: Partial<AppSettingFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const AppSettingForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: AppSettingFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<AppSettingFormData>({
        defaultValues: defaultValues || {
            key: '',
            value: '',
            type: 'TEXT',
            isActive: true,
        },
        resolver: zodResolver(appSettingValidationSchema),
    })

    const currentType = watch('type')

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {isNew ? 'Add New Setting' : 'Edit Setting'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Setting Details</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="key"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Key"
                                            invalid={!!errors.key}
                                            errorMessage={errors.key?.message}
                                            extra={
                                                isNew
                                                    ? 'Lowercase, camelCase / kebab-case, e.g. termsAndConditions. Cannot be changed after creation.'
                                                    : 'The key is immutable and cannot be changed.'
                                            }
                                        >
                                            <Input
                                                {...field}
                                                disabled={!isNew}
                                                placeholder="e.g., termsAndConditions"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Type"
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
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Active Status">
                                            <Switcher
                                                checked={field.value}
                                                checkedContent={
                                                    <span className="inline-block w-16 text-xs font-semibold">
                                                        Active
                                                    </span>
                                                }
                                                unCheckedContent={
                                                    <span className="inline-block w-16 text-xs font-semibold">
                                                        Inactive
                                                    </span>
                                                }
                                                onChange={(checked) =>
                                                    field.onChange(checked)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                {currentType === 'HTML' ? (
                                    <Controller
                                        name="value"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Value (Rich Content)"
                                                invalid={!!errors.value}
                                                errorMessage={
                                                    errors.value?.message
                                                }
                                                extra="Rich text editor — the rendered HTML is what the mobile app displays."
                                            >
                                                <RichTextEditor
                                                    content={field.value}
                                                    onChange={({
                                                        html,
                                                    }: {
                                                        text: string
                                                        html: string
                                                        json: unknown
                                                    }) => {
                                                        field.onChange(html)
                                                    }}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                ) : currentType === 'PHONE' ? (
                                    <Controller
                                        name="value"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Value (Phone Number)"
                                                invalid={!!errors.value}
                                                errorMessage={
                                                    errors.value?.message
                                                }
                                                extra="The mobile app renders this as a tappable tel: link."
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., +959123456789"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <Controller
                                        name="value"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Value"
                                                invalid={!!errors.value}
                                                errorMessage={
                                                    errors.value?.message
                                                }
                                            >
                                                <Input
                                                    textArea
                                                    rows={6}
                                                    {...field}
                                                    placeholder="Enter the setting value (plain text)"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default AppSettingForm
