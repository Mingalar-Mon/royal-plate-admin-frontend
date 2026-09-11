import Dialog from '@/components/ui/Dialog'
import dayjs from 'dayjs'
import { TbCalendar, TbLink, TbUser } from 'react-icons/tb'
import { ActionLink } from '@/components/shared'
import BannerTypeBadge from '../../components/BannerTypeBadge'

const URL_REGEX =
    /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/

interface BannerViewModalProps {
    banner: any | null
    onClose: () => void
}

const BannerViewModal = ({ banner, onClose }: BannerViewModalProps) => {
    if (!banner) return null

    const link = banner.linkToRestaurant
    const isUrl =
        typeof link === 'string' && URL_REGEX.test(link) && new URL(link)

    return (
        <Dialog
            isOpen={Boolean(banner)}
            width={620}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Banner Details
                    </h1>
                    <BannerTypeBadge type={banner.type} />
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                    <img
                        src={banner.image?.url}
                        alt="Promotional campaign banner preview"
                        className="mx-auto max-h-64 w-full select-none object-contain"
                    />
                </div>

                <div className="mt-4 space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2.5">
                        <TbLink className="shrink-0 text-lg text-gray-400" />
                        <span>
                            Linked Target:{' '}
                            {isUrl ? (
                                <ActionLink
                                    href={link}
                                    target="_blank"
                                    className="cursor-pointer break-all hover:underline"
                                >
                                    {link}
                                </ActionLink>
                            ) : (
                                <strong className="mt-0.5 block break-all rounded bg-gray-50 p-1.5 font-mono text-xs font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                    {link}
                                </strong>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <TbUser className="text-lg text-gray-400" />
                        <span>
                            Authorizing Admin:{' '}
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {banner.authorAdmin?.name || 'System Admin'}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <TbCalendar className="text-lg text-gray-400" />
                        <span>
                            Created:{' '}
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {dayjs(banner.created_at).format(
                                    'DD MMM YYYY, HH:mm',
                                )}
                            </strong>
                        </span>
                    </div>
                    {banner.updated_at && (
                        <div className="flex items-center gap-2.5">
                            <TbCalendar className="text-lg text-gray-400" />
                            <span>
                                Updated:{' '}
                                <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                    {dayjs(banner.updated_at).format(
                                        'DD MMM YYYY, HH:mm',
                                    )}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}

export default BannerViewModal