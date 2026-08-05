import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
// import FormItem from '@/components/ui/FormItem'
import Select from '@/components/ui/Select'
import { TbFilter } from 'react-icons/tb'
import { useStaffList } from '@/utils/custom-hooks/useStaff'
import { useParams } from 'react-router'

const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'chef', label: 'Chef' },
]

const StaffTableFilter = () => {
    const { restaurantId } = useParams()
    const { tableData, setTableData } = useStaffList(restaurantId!)
    const [isOpen, setIsOpen] = useState(false)
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { role: tableData.role || '' },
    })

    const onSubmit = (values: any) => {
        setTableData({ ...tableData, ...values, pageIndex: 1 })
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ role: '' })
        setTableData({ ...tableData, role: '', pageIndex: 1 })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Staff"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    containerClassName="flex flex-col justify-between h-full"
                >
                    <div>
                        <FormItem label="Role">
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={roleOptions}
                                        value={roleOptions.find(
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

export default StaffTableFilter
