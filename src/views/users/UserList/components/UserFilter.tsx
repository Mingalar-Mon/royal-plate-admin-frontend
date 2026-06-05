import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useUserTableStore } from '@/store/userStore'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { TbFilter } from 'react-icons/tb'

const verifiedOptions = [
    { value: '', label: 'All' },
    { value: 'verified', label: 'Verified' },
    { value: 'unverified', label: 'Unverified' },
]

const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
]

const UserFilter = () => {
    // ✅ Extract shared parameters directly from global store slots
    const tableData = useUserTableStore((state) => state.tableData)
    const setTableData = useUserTableStore((state) => state.setTableData)
    const resetFilters = useUserTableStore((state) => state.resetFilters)
    const [isOpen, setIsOpen] = useState(false)

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            isVerified: tableData.isVerified || '',
            gender: tableData.gender || '',
        },
    })

    const onSubmit = (values: any) => {
        setTableData((prev) => ({ ...prev, ...values, pageIndex: 1 }))
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ isVerified: '', gender: '' })
        resetFilters()
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Users"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    containerClassName="flex flex-col justify-between h-full"
                >
                    <div className="space-y-4">
                        <FormItem label="Verification Status">
                            <Controller
                                name="isVerified"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={verifiedOptions}
                                        value={verifiedOptions.find(
                                            (opt) => opt.value === field.value,
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Gender">
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={genderOptions}
                                        value={genderOptions.find(
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

export default UserFilter
