import Card from '@/components/ui/Card'
import DOMPurify from 'dompurify'

const OrderDetailNote = ({ notes }: { notes?: string }) => {
    if (!notes) return null
    return (
        <Card>
            <h4 className="mb-4">Special Instructions</h4>
            <div
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notes) }}
            />
        </Card>
    )
}

export default OrderDetailNote
