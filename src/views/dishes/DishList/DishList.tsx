import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DishListActionTools from '../components/DishListActionTool'
import DishListTableTools from '../components/DishListTableTools'
import DishListTable from '../components/DishListTable'

import { useGetDishes } from '@/utils/custom-hooks/useDish'
import { useParams } from 'react-router'
import { useDishStore } from '@/store/dishStore'

const DishList = () => {
    const { restaurantId } = useParams()
    const tableData = useDishStore((state) => state.tableData)

    const { dishes, total, refetch, isLoading } = useGetDishes({
        restaurantId: restaurantId!,
        params: tableData,
    })

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Menu</h3>
                        <DishListActionTools onRefresh={refetch} />
                    </div>
                    <DishListTableTools />
                    <DishListTable
                        dishList={dishes}
                        dishListTotal={total}
                        isLoading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default DishList
