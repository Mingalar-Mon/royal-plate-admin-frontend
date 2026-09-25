import { useParams, useNavigate } from 'react-router'
import { useAppSettingDetailQuery } from '@/utils/custom-hooks/useAppSetting'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import DOMPurify from 'dompurify'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbCalendar,
    TbKey,
    TbToggleLeft,
} from 'react-icons/tb'
import dayjs from 'dayjs'
import { ActionLink } from '@/components/shared'

const typeTagColor: Record<string, string> = {
    TEXT: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900/30',
    PHONE: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30',
    HTML: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/30',
}

const AppSettingDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: settingResponse, isLoading } = useAppSettingDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    const setting = settingResponse?.data
    if (!setting)
        return <div className="p-8 text-center">Setting not found</div>

    const isHtml = setting.type === 'HTML'
    const isPhone = setting.type === 'PHONE'

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/settings')}
                        >
                            Back to App Settings
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() =>
                                navigate(`/settings/edit/${setting.id}`)
                            }
                        >
                            Edit Setting
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <TbKey className="text-lg text-gray-400 shrink-0" />
                                        <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 break-all">
                                            {setting.key}
                                        </h4>
                                    </div>
                                    <Tag
                                        className={`${typeTagColor[setting.type]} shrink-0`}
                                    >
                                        {setting.type}
                                    </Tag>
                                </div>
                                {isHtml ? (
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                setting.value,
                                            ),
                                        }}
                                    />
                                ) : isPhone ? (
                                    setting.value ? (
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            <ActionLink
                                                href={`tel:${setting.value}`}
                                                className="text-primary-600 hover:underline"
                                            >
                                                {setting.value}
                                            </ActionLink>
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-gray-400">
                                            (empty value)
                                        </p>
                                    )
                                ) : (
                                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                                        {setting.value || '(empty value)'}
                                    </p>
                                )}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Setting Information
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbKey className="text-gray-400 text-lg shrink-0" />
                                        <span className="min-w-0">
                                            Key:{' '}
                                            <strong className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100 break-all">
                                                {setting.key}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbToggleLeft className="text-gray-400 text-lg shrink-0" />
                                        <span>
                                            Status:{' '}
                                            <strong
                                                className={
                                                    setting.isActive
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-red-500 dark:text-red-400'
                                                }
                                            >
                                                {setting.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                                        <TbCalendar className="text-gray-400 text-lg shrink-0" />
                                        <span>
                                            Created:{' '}
                                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    setting.createdAt,
                                                ).format('DD MMM YYYY, HH:mm')}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg shrink-0" />
                                        <span>
                                            Updated:{' '}
                                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    setting.updatedAt,
                                                ).format('DD MMM YYYY, HH:mm')}
                                            </strong>
                                        </span>
                                    </div>
                                    {!setting.isActive && (
                                        <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                                            This setting is inactive and is
                                            hidden from the mobile app.
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </AdaptiveCard>
    )
}

export default AppSettingDetail
