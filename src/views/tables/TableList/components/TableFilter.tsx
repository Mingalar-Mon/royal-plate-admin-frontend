import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'

import Select from '@/components/ui/Select'
import { TbFilter } from 'react-icons/tb'
import { useTableListQuery } from '@/utils/custom-hooks/useTable'
import { useParams } from 'react-router'
import { useTableStore } from '@/store/tableStore'

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'vip', label: 'VIP' },
    { value: 'standard', label: 'Standard' },
    { value: 'family', label: 'Family' },
]

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
]

const TableFilter = () => {
    const { restaurantId } = useParams()
    // const { tableData, setTableData } = useTableListQuery(restaurantId!)
    const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)
    const [isOpen, setIsOpen] = useState(false)
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            type: tableData.type || '',
            status: tableData.status || '',
        },
    })

    const onSubmit = (values: any) => {
        setTableData({ ...tableData, ...values, pageIndex: 1 })
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ type: '', status: '' })
        setTableData({ ...tableData, type: '', status: '', pageIndex: 1 })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Tables"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    containerClassName="flex flex-col justify-between h-full"
                >
                    <div className="space-y-4">
                        <FormItem label="Table Type">
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={typeOptions}
                                        value={typeOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
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

export default TableFilter
