import { useParams, useNavigate } from 'react-router'
import { useAppVersionDetailQuery } from '@/utils/custom-hooks/useAppVersion'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbCalendar,
    TbLink,
    TbTag,
} from 'react-icons/tb'
import dayjs from 'dayjs'
import { ActionLink } from '@/components/shared'

const AppVersionDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: versionResponse, isLoading } = useAppVersionDetailQuery(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    const version = versionResponse?.data
    if (!version)
        return <div className="p-8 text-center">App version not found</div>

    const links = [
        { label: 'Play Store', value: version.playStoreLink },
        { label: 'iOS', value: version.iosLink },
        { label: 'Direct Download', value: version.directDownloadLink },
    ]

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/app-versions')}
                        >
                            Back to App Versions
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() =>
                                navigate(`/app-versions/edit/${version.id}`)
                            }
                        >
                            Edit App Version
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    {version.title}
                                </h4>
                                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {version.body}
                                </p>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Version Information
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbTag className="text-gray-400 text-lg shrink-0" />
                                        <span>
                                            Version Code:{' '}
                                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                                {version.versionCode}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbTag className="text-gray-400 text-lg shrink-0" />
                                        <span>
                                            Version Name:{' '}
                                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                                {version.versionName}
                                            </strong>
                                        </span>
                                    </div>
                                    {links.map((link) => (
                                        <div
                                            key={link.label}
                                            className="flex items-center gap-2.5 border-t border-gray-100 dark:border-gray-800 pt-3"
                                        >
                                            <TbLink className="text-gray-400 text-lg shrink-0" />
                                            <span className="min-w-0">
                                                {link.label}:
                                                <ActionLink
                                                    href={link.value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="cursor-pointer block truncate hover:underline"
                                                >
                                                    {link.value}
                                                </ActionLink>
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Created:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    version.createdAt,
                                                ).format('DD MMM YYYY, HH:mm')}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Updated:{' '}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(
                                                    version.updatedAt,
                                                ).format('DD MMM YYYY, HH:mm')}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </AdaptiveCard>
    )
}

export default AppVersionDetail
