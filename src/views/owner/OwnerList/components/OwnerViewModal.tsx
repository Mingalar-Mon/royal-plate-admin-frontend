import Dialog from '@/components/ui/Dialog'
import dayjs from 'dayjs'
import {
    TbBuildingStore,
    TbCalendar,
    TbId,
    TbMail,
    TbPhone,
} from 'react-icons/tb'

interface OwnerViewModalProps {
    owner: any | null
    onClose: () => void
}

const OwnerViewModal = ({ owner, onClose }: OwnerViewModalProps) => {
    if (!owner) return null

    return (
        <Dialog
            isOpen={Boolean(owner)}
            width={520}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {owner.name}
                    </h1>
                    {/* <p className="mt-1 select-all font-mono text-xs text-gray-400">
                        Owner ID: {owner.id}
                    </p> */}
                </div>

                <div className="mt-4 space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2.5">
                        <TbMail className="text-lg text-gray-400" />
                        <span>
                            Email Address:{' '}
                            <strong className="font-medium text-gray-900 dark:text-gray-100">
                                {owner.email}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <TbPhone className="text-lg text-gray-400" />
                        <span>
                            Phone Number:{' '}
                            <strong className="font-medium text-gray-900 dark:text-gray-100">
                                {owner.phone || '—'}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                        <TbId className="text-lg text-indigo-500" />
                        <span>
                            Merchant Security Code:{' '}
                            <strong className="ml-1 rounded bg-indigo-50 px-2 py-1 font-mono text-xs font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                {owner.code || '—'}
                            </strong>
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbBuildingStore />
                            <span>Restaurants</span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                            {owner.restaurants?.length || 0}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbCalendar />
                            <span>Joined</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {dayjs(owner.created_at).format('DD MMM YYYY')}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <TbCalendar />
                            <span>Last Updated</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {dayjs(owner.updated_at).format('DD MMM YYYY')}
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default OwnerViewModal