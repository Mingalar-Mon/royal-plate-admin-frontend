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
    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="solid"
                icon={<TbPlus className="text-lg" />}
                onClick={onAdd}
            >
                <span className="hidden sm:inline">Add Dish</span>
            </Button>
            <Button
                size="sm"
                icon={<TbRefresh className="text-lg" />}
                onClick={onRefresh}
            >
                <span className="hidden sm:inline">Refresh</span>
            </Button>
        </div>
    )
}

export default DishListActionTools
