import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import {
    commissionValidationSchema,
    type CommissionFormData,
    type CommissionFormInput,
    type CommissionFormOutput,
} from '@/@types/commission'

interface CommissionFormProps {
    onFormSubmit: (data: CommissionFormData) => void
    defaultValues?: Partial<CommissionFormData>
    children?: React.ReactNode
}

const CommissionForm = ({
    onFormSubmit,
    defaultValues,
    children,
}: CommissionFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CommissionFormInput, any, CommissionFormOutput>({
        defaultValues: defaultValues || { percentage: '' },
        resolver: zodResolver(commissionValidationSchema),
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Add Restaurant Commission
                    </h3>
                </div>

                <Card>
                    <h4 className="mb-4">Commission Details</h4>
                    <Controller
                        name="percentage"
                        control={control}
                        render={({ field }) => (
                            <FormItem
                                label="Percentage"
                                asterisk
                                invalid={!!errors.percentage}
                                errorMessage={errors.percentage?.message}
                                extra="0–100"
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step="any"
                                    value={
                                        field.value === '' ||
                                        field.value === undefined ||
                                        field.value === null ||
                                        field.value === 0
                                            ? ''
                                            : String(field.value)
                                    }
                                    placeholder="Enter commission percentage"
                                    onChange={(event) =>
                                        field.onChange(event.target.value)
                                    }
                                    onBlur={(event) => {
                                        const raw = event.target.value
                                        if (raw !== '') {
                                            const num = Number(raw)
                                            if (Number.isFinite(num))
                                                field.onChange(String(num))
                                        }
                                        field.onBlur()
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                </Card>

                <div className="mt-6 flex flex-col gap-4">{children}</div>
            </Container>
        </Form>
    )
}

export default CommissionForm
