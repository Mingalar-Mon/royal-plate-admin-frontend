import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { TbCalendar, TbToggleLeft, TbKey } from 'react-icons/tb'
import { ActionLink } from '@/components/shared'
import { stripHtmlTags } from '@/utils/helpers/blogContent.helper'
import type { AppSetting } from '@/@types/appSetting'

const typeTagColor: Record<AppSetting['type'], string> = {
    TEXT: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30',
    PHONE: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30',
    HTML: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/30',
}

interface AppSettingViewModalProps {
    setting: AppSetting | null
    onClose: () => void
}

const AppSettingViewModal = ({
    setting,
    onClose,
}: AppSettingViewModalProps) => {
    if (!setting) return null

    const isHtml = setting.type === 'HTML'
    const isPhone = setting.type === 'PHONE'

    return (
        <Dialog
            isOpen={Boolean(setting)}
            width={640}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-6">
                <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <TbKey className="text-lg text-gray-400 shrink-0" />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 break-all">
                                {setting.key}
                            </h1>
                        </div>
                        <Tag
                            className={`${typeTagColor[setting.type]} shrink-0`}
                        >
                            {setting.type}
                        </Tag>
                    </div>
                </div>

                <div className="mt-5">
                    {isHtml ? (
                        <div
                            className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(setting.value),
                            }}
                        />
                    ) : isPhone ? (
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                            <ActionLink
                                href={`tel:${setting.value}`}
                                className="text-primary-600 hover:underline"
                            >
                                {setting.value}
                            </ActionLink>
                        </p>
                    ) : setting.value ? (
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400 break-words">
                            {stripHtmlTags(setting.value)}
                        </p>
                    ) : (
                        <p className="text-sm italic text-gray-400">
                            (empty value)
                        </p>
                    )}
                </div>

                <div className="mt-6 space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2.5">
                        <TbToggleLeft className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Status:{' '}
                            <strong
                                className={
                                    setting.isActive
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-red-500 dark:text-red-400'
                                }
                            >
                                {setting.isActive ? 'Active' : 'Inactive'}
                            </strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3.5 dark:border-gray-800">
                        <TbCalendar className="text-lg text-gray-400 shrink-0" />
                        <span>
                            Created:{' '}
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {dayjs(setting.createdAt).format(
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
                                {dayjs(setting.updatedAt).format(
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

export default AppSettingViewModal
