import Card from '@/components/ui/Card'
import DOMPurify from 'dompurify'
import { TbMessage2 } from 'react-icons/tb'

const OrderDetailNote = ({ notes }: { notes?: string }) => {
    if (!notes?.trim()) return null

    return (
        <Card>
            <div className="flex items-center gap-2 mb-4">
                <TbMessage2 className="text-gray-500" />
                <h4 className="mb-0">Special Instructions</h4>
            </div>
            <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notes) }}
            />
        </Card>
    )
}

export default OrderDetailNote
