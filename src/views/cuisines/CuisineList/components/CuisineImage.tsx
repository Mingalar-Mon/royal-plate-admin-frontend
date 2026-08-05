import Avatar from '@/components/ui/Avatar'
import { TbPhoto } from 'react-icons/tb'

const CuisineImage = ({ src, name }: { src?: string; name: string }) => {
    if (!src) {
        return (
            <Avatar
                shape="round"
                size={40}
                icon={<TbPhoto className="text-xl" />}
            />
        )
    }
    return <Avatar shape="round" size={40} src={src} alt={name} />
}

export default CuisineImage
