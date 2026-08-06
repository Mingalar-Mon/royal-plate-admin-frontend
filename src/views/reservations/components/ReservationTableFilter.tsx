import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'

import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { TbFilter } from 'react-icons/tb'
// import { useReservations } from '@/utils/custom-hooks/useReservation'
import { useReservationStore } from '@/store/reservationStore'

const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'complete', label: 'Complete' },
]

// {
//     tableData,
//     setTableData,
// }: {
//     tableData: any
//     setTableData: any
// }
const ReservationTableFilter = () => {
    const [isOpen, setIsOpen] = useState(false)
    const tableData = useReservationStore((state) => state.tableData)
    const setTableData = useReservationStore((state) => state.setTableData)
    // const { tableData, setTableData } = useReservations()
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            status: tableData.status || '',
            dateFrom: tableData.dateFrom || '',
            dateTo: tableData.dateTo || '',
        },
    })

    const onSubmit = (values: any) => {
        setTableData((prev) => {
            // console.log('Previous table data:', prev)
            // console.log('Updating table data with values:', values)
            return { ...prev, ...values, pageIndex: 1 }
        })
        // setTableData({ ...tableData, ...values, pageIndex: 1 })
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

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Reservations"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
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
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
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
                        <Button variant="default" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button variant="solid" type="submit">
                            Apply
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default ReservationTableFilter
