import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import dayjs from 'dayjs'
import { TbCalendar, TbLink, TbTag } from 'react-icons/tb'
import type { AppVersion } from '@/@types/appVersion'

interface AppVersionViewModalProps {
    version: AppVersion | null
    onClose: () => void
}

const AppVersionViewModal = ({
    version,
    onClose,
}: AppVersionViewModalProps) => {
    if (!version) return null

    const links = [
        { label: 'Play Store', value: version.playStoreLink },
        { label: 'iOS', value: version.iosLink },
        { label: 'Direct Download', value: version.directDownloadLink },
    ]

    return (
        <Dialog
            isOpen={Boolean(version)}
            width={560}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {version.title}
                    </h1>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {version.body}
                </p>

                <div className="mt-5 space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2.5">
                        <TbTag className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Version Code:{' '}
                            <strong className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                                {version.versionCode}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <TbTag className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Version Name:{' '}
                            <strong className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                                {version.versionName}
                            </strong>
                        </span>
                    </div>

                    {links.map((link) => (
                        <div
                            key={link.label}
                            className="flex items-center gap-2.5 border-t border-gray-100 pt-3.5 dark:border-gray-800"
                        >
                            <TbLink className="text-lg text-gray-400 shrink-0" />
                            <span className="min-w-0">
                                {link.label}:{' '}
                                <strong className="block break-all font-medium text-gray-900 dark:text-gray-100">
                                    {link.value}
                                </strong>
                            </span>
                        </div>
                    ))}

                    <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3.5 dark:border-gray-800">
                        <TbCalendar className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Created:{' '}
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {dayjs(version.createdAt).format(
                                    'DD MMM YYYY, HH:mm',
                                )}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <TbCalendar className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Updated:{' '}
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {dayjs(version.updatedAt).format(
                                    'DD MMM YYYY, HH:mm',
                                )}
                            </strong>
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="solid" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AppVersionViewModal