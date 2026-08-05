// components/OrderListSearch.tsx
import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import { ChangeEvent } from 'react'
import useDebounce from '@/utils/hooks/useDebounce'

const OrderListSearch = ({
    onInputChange,
}: {
    onInputChange: (value: string) => void
}) => {
    const debounceFn = useDebounce(onInputChange, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            placeholder="Search by order # or customer"
            suffix={<TbSearch className="text-lg" />}
            onChange={handleInputChange}
        />
    )
}

export default OrderListSearch
