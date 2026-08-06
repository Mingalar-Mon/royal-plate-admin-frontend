import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'

import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import { TbFilter, TbMinus } from 'react-icons/tb'
import { useDishList } from '@/utils/custom-hooks/useDish'

import { useGetAllCuisines } from '@/views/owner/hooks/useRestaurantProfile'
import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'
import { useDishStore } from '@/store/dishStore'
import { useCuisineStore } from '@/store/cuisineStore'

const statusOptions = [
    { value: '', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
]

const categoryList = [
    'Pizza',
    'Noodles',
    'Salad',
    'Curry',
    'Japanese',
    'Fast Food',
]

const validationSchema = z.object({
    minPrice: z.union([z.string(), z.number()]).optional(),
    maxPrice: z.union([z.string(), z.number()]).optional(),
    status: z.string().optional(),
    category: z.array(z.string()).optional(),
})

type FilterFormData = z.infer<typeof validationSchema>

const DishTableFilter = () => {
    const { tableData } = useCuisineStore()
    // FIX:
    const { data: cuisines } = useGetCuisines(tableData)

    const { tableData: dishQueries, setTableData: setDishQueries } =
        useDishStore()

    const [isOpen, setIsOpen] = useState(false)
    // const { filterData, setFilterData } = useDishList()
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            minPrice: dishQueries.minPrice || '',
            maxPrice: dishQueries.maxPrice || '',
            status: dishQueries.status || '',
            category: dishQueries.category || [],
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FilterFormData) => {
        setDishQueries((prev) => ({ ...prev, ...values, pageIndex: 1 }))
        setIsOpen(false)
    }

    const handleClear = () => {
        reset({ minPrice: '', maxPrice: '', status: '', category: [] })
        setDishQueries((prev) => ({
            ...prev,
            minPrice: '',
            maxPrice: '',
            status: '',
            category: [],
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
                title="Filter Dishes"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Form
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <FormItem label="Price range">
                            <div className="flex items-center gap-2">
                                <Controller
                                    name="minPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Min"
                                            prefix="MMK"
                                        />
                                    )}
                                />
                                <TbMinus />
                                <Controller
                                    name="maxPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Max"
                                            prefix="MMK"
                                        />
                                    )}
                                />
                            </div>
                        </FormItem>
                        <FormItem label="Availability">
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
                        <FormItem label="Category">
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox.Group
                                        vertical
                                        className="flex"
                                        {...field}
                                    >
                                        {cuisines?.data.map((cat) => (
                                            <Checkbox
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.name}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="default" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button variant="solid" type="submit">
                            Apply Filter
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default DishTableFilter
