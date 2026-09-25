import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import useDebounce from '@/utils/hooks/useDebounce'
import { ChangeEvent } from 'react'

const AppSettingListSearch = ({
    onSearch,
}: {
    onSearch: (value: string) => void
}) => {
    const debouncedSearch = useDebounce(onSearch, 500)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    return (
        <Input
            placeholder="Search by key or value"
            prefix={<TbSearch className="text-lg" />}
            onChange={handleChange}
        />
    )
}

export default AppSettingListSearch
