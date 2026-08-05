import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'

import Select from '@/components/ui/Select'
import { TbFilter } from 'react-icons/tb'

import { useBannerStore } from '@/store/bannerStore'

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'in_app', label: 'In App' },
    { value: 'external', label: 'External' },
]

const BannerFilter = () => {
    const tableData = useBannerStore((state) => state.tableData)
    const setTableData = useBannerStore((state) => state.setTableData)
    const [isOpen, setIsOpen] = useState(false)
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { type: tableData.type || '' },
    })

    const onSubmit = (values: any) => {
        setTableData((prev) => ({ ...prev, ...values, pageIndex: 1 }))
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ type: '' })
        setTableData((prev) => ({ ...prev, type: '', pageIndex: 1 }))
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Banners"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    containerClassName="flex flex-col justify-between h-full"
                >
                    <div>
                        <FormItem label="Banner Type">
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

export default BannerFilter
