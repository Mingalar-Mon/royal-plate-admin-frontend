import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import useDebounce from '@/utils/hooks/useDebounce'
import { ChangeEvent } from 'react'

type DishListSearchProps = { onInputChange: (value: string) => void }

const DishListSearch = ({ onInputChange }: DishListSearchProps) => {
    const debounceFn = useDebounce(onInputChange, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            placeholder="Search by name or category"
            suffix={<TbSearch className="text-lg" />}
            onChange={handleInputChange}
        />
    )
}

export default DishListSearch
