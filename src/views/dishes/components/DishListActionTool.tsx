import Button from '@/components/ui/Button'
import { TbPlus, TbRefresh } from 'react-icons/tb'

type DishListActionToolsProps = {
    onAdd: () => void
    onRefresh: () => void
}

const DishListActionTools = ({
    onAdd,
    onRefresh,
}: DishListActionToolsProps) => {
    // const { dishList } = useDishList()

    return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {/*             
            <CSVLink filename="menu-list.csv" data={dishList}>
                <Button icon={<TbCloudDownload className="text-xl" />}>
                    Export
                </Button>
            </CSVLink> */}
            <Button
                variant="solid"
                className="w-full sm:w-auto"
                icon={<TbPlus className="text-xl" />}
                onClick={onAdd}
            >
                Add Dish
            </Button>
            <Button className="w-full sm:w-auto" icon={<TbRefresh />} onClick={onRefresh}>
                Refresh
            </Button>
        </div>
    )
}

export default DishListActionTools
