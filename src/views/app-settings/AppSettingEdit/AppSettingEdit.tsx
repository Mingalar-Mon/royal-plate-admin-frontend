import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    useAppSettingDetailQuery,
    useUpdateAppSettingMutation,
    useDeleteAppSettingMutation,
} from '@/utils/custom-hooks/useAppSetting'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Loading from '@/components/shared/Loading'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import AppSettingForm from '../components/AppSettingForm'
import type {
    AppSettingFormData,
    AppSettingUpdateData,
} from '@/@types/appSetting'

const AppSettingEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const { data: settingResponse, isLoading } = useAppSettingDetailQuery(id!)
    const { mutate: updateAppSetting, isPending: isUpdating } =
        useUpdateAppSettingMutation()
    const { mutate: deleteAppSetting } = useDeleteAppSettingMutation()

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

    const defaultValues: AppSettingFormData = {
        key: setting.key,
        value: setting.value,
        type: setting.type,
        isActive: setting.isActive,
    }

    const handleSubmit = (formData: AppSettingFormData) => {
        // `key` is immutable — only value / type / isActive are sent on PATCH.
        const payload: AppSettingUpdateData = {
            value: formData.value,
            type: formData.type,
            isActive: formData.isActive,
        }
        updateAppSetting(
            { id: id!, data: payload },
            {
                onSuccess: () => navigate('/settings'),
            },
        )
    }

    const handleDelete = () => {
        deleteAppSetting(id!, {
            onSuccess: () => navigate('/settings'),
        })
        setDeleteConfirmationOpen(false)
    }

    return (
        <Loading type="cover" loading={isUpdating}>
            <AdaptiveCard>
                <AppSettingForm
                    defaultValues={defaultValues}
                    isNew={false}
                    onFormSubmit={handleSubmit}
                >
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => navigate('/settings')}
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
                </AppSettingForm>

                <ConfirmDialog
                    isOpen={deleteConfirmationOpen}
                    type="danger"
                    title="Delete Setting"
                    onClose={() => setDeleteConfirmationOpen(false)}
                    onCancel={() => setDeleteConfirmationOpen(false)}
                    onConfirm={handleDelete}
                >
                    <p>
                        Are you sure you want to delete this setting? This will
                        remove the setting from the app immediately and cannot
                        be undone.
                    </p>
                </ConfirmDialog>
            </AdaptiveCard>
        </Loading>
    )
}

export default AppSettingEdit
