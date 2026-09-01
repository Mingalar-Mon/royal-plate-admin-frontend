import { ChangeEvent } from 'react'
import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import useDebounce from '@/utils/hooks/useDebounce'

const CommissionListSearch = ({
    onSearch,
}: {
    onSearch: (value: string) => void
}) => {
    const debouncedSearch = useDebounce(onSearch, 500)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value)
    }

    return (
        <Input
            placeholder="Search commissions"
            suffix={<TbSearch className="text-lg" />}
            onChange={handleChange}
        />
    )
}

export default CommissionListSearch
