import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    useAppVersionDetailQuery,
    useUpdateAppVersionMutation,
    useDeleteAppVersionMutation,
} from '@/utils/custom-hooks/useAppVersion'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Loading from '@/components/shared/Loading'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import AppVersionForm from '../components/AppVersionForm'
import type { AppVersionFormData } from '@/@types/appVersion'

const AppVersionEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const { data: versionResponse, isLoading } = useAppVersionDetailQuery(id!)
    const { mutate: updateAppVersion, isPending: isUpdating } =
        useUpdateAppVersionMutation()
    const { mutate: deleteAppVersion } = useDeleteAppVersionMutation()

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

    const defaultValues: AppVersionFormData = {
        title: version.title,
        body: version.body,
        versionCode: version.versionCode,
        versionName: version.versionName,
        playStoreLink: version.playStoreLink,
        iosLink: version.iosLink,
        directDownloadLink: version.directDownloadLink,
    }

    const handleSubmit = (formData: AppVersionFormData) => {
        updateAppVersion(
            { id: id!, data: formData },
            {
                onSuccess: () => navigate('/app-versions'),
            },
        )
    }

    const handleDelete = () => {
        deleteAppVersion(id!, {
            onSuccess: () => navigate('/app-versions'),
        })
        setDeleteConfirmationOpen(false)
    }

    return (
        <Loading type="cover" loading={isUpdating}>
            <AdaptiveCard>
                <AppVersionForm
                    defaultValues={defaultValues}
                    isNew={false}
                    onFormSubmit={handleSubmit}
                >
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/app-versions')}
                        >
                            Back
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="default"
                                icon={<TbTrash />}
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setDeleteConfirmationOpen(true)}
                            >
                                Delete
                            </Button>
                            <Button type="submit" variant="solid">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </AppVersionForm>

                <ConfirmDialog
                    isOpen={deleteConfirmationOpen}
                    type="danger"
                    title="Delete App Version"
                    onClose={() => setDeleteConfirmationOpen(false)}
                    onCancel={() => setDeleteConfirmationOpen(false)}
                    onConfirm={handleDelete}
                >
                    <p>
                        Are you sure you want to permanently remove this app
                        version? This action cannot be undone.
                    </p>
                </ConfirmDialog>
            </AdaptiveCard>
        </Loading>
    )
}

export default AppVersionEdit
