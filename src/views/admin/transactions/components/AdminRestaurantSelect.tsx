import Select from '@/components/ui/Select'
import { useTransactionStore } from '@/store/transactionStore'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'

const AdminRestaurantSelect = () => {
    const tableData = useTransactionStore((state) => state.tableData)
    const setTableData = useTransactionStore((state) => state.setTableData)

    const { data: restaurantsResponse, isLoading } = useGetRestaurantList()

    const options = (restaurantsResponse?.data || []).map((restaurant) => ({
        value: restaurant.id,
        label: restaurant.name,
    }))

    const filterOption = (
        option: { label: string; value: string },
        search: string,
    ) => option.label.toLowerCase().includes(search.toLowerCase())

    return (
        <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                Restaurant
            </span>
            <Select
                isSearchable
                size="sm"
                className="w-72"
                placeholder="Search or select a restaurant"
                isLoading={isLoading}
                options={options}
                filterOption={filterOption}
                noOptionsMessage={() => 'No restaurant found'}
                value={
                    options.find(
                        (option) => option.value === tableData.restaurantId,
                    ) || null
                }
                onChange={(option) =>
                    setTableData((prev) => ({
                        ...prev,
                        restaurantId: option?.value || '',
                        page: 1,
                    }))
                }
            />
        </div>
    )
}

export default AdminRestaurantSelect
