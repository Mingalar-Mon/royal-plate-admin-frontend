import Card from '@/components/ui/Card'
import DOMPurify from 'dompurify'
import { TbMessage2 } from 'react-icons/tb'

const OrderDetailNote = ({ notes }: { notes?: string }) => {
    if (!notes?.trim()) return null

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <TbMessage2 className="text-lg text-primary" />
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Special Instructions
                        </h4>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notes) }}
            />
        </Card>
    )
}

export default OrderDetailNote
