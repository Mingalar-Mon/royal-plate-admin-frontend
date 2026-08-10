import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { TbFilter } from 'react-icons/tb'
import { useReservationStore } from '@/store/reservationStore'
import type { ReservationStatus } from '../types/reservation.type'

const statusOptions: { value: ReservationStatus | ''; label: string }[] = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'seated', label: 'Seated' },
    { value: 'completed', label: 'Completed' },
    { value: 'no_show', label: 'No show' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'canceled', label: 'Canceled' },
]

type FilterValues = {
    status: ReservationStatus | ''
    dateFrom: string
    dateTo: string
}

const ReservationTableFilter = () => {
    const [isOpen, setIsOpen] = useState(false)
    const tableData = useReservationStore((state) => state.tableData)
    const setTableData = useReservationStore((state) => state.setTableData)
    const { control, handleSubmit, reset } = useForm<FilterValues>({
        defaultValues: {
            status: tableData.status,
            dateFrom: tableData.dateFrom,
            dateTo: tableData.dateTo,
        },
    })

    useEffect(() => {
        reset({
            status: tableData.status,
            dateFrom: tableData.dateFrom,
            dateTo: tableData.dateTo,
        })
    }, [reset, tableData.status, tableData.dateFrom, tableData.dateTo])

    const onSubmit = (values: FilterValues) => {
        setTableData((prev) => ({ ...prev, ...values, pageIndex: 1 }))
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ status: '', dateFrom: '', dateTo: '' })
        setTableData((prev) => ({
            ...prev,
            status: '',
            dateFrom: '',
            dateTo: '',
            pageIndex: 1,
        }))
        setIsOpen(false)
    }

    const activeFilterCount = [
        tableData.status,
        tableData.dateFrom,
        tableData.dateTo,
    ].filter(Boolean).length

    return (
        <>
            <Button
                className="relative"
                icon={<TbFilter />}
                onClick={() => setIsOpen(true)}
            >
                Filter
                {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                        {activeFilterCount}
                    </span>
                )}
            </Button>
            <Drawer
                title="Filter reservations"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={(event) => {
                        void handleSubmit(onSubmit)(event)
                    }}
                >
                    <div className="space-y-4">
                        <FormItem label="Status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={statusOptions}
                                        value={statusOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value || '')
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Date from">
                            <Controller
                                name="dateFrom"
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" {...field} />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Date to">
                            <Controller
                                name="dateTo"
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" {...field} />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                        <Button variant="solid" type="submit">
                            Apply filters
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default ReservationTableFilter
