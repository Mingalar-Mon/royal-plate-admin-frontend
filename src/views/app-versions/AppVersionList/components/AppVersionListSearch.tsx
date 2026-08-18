import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import useDebounce from '@/utils/hooks/useDebounce'
import { ChangeEvent } from 'react'

const AppVersionListSearch = ({
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
            placeholder="Search by title or version name"
            suffix={<TbSearch className="text-lg" />}
            onChange={handleChange}
        />
    )
}

export default AppVersionListSearch
