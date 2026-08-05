import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbMail,
    TbCalendar,
    TbId,
} from 'react-icons/tb'

import { useStaff } from '@/utils/custom-hooks/useStaff'
import StaffRoleBadge from '../StaffList/components/StaffRoleBadge'
import dayjs from 'dayjs'

const StaffDetail = () => {
    const { staffId, restaurantId } = useParams()
    const navigate = useNavigate()

    const { data: staffResponse, isLoading } = useStaff(staffId!)
    const staff = staffResponse?.data

    if (isLoading) return <div className="p-8 text-center">Loading...</div>
    if (!staff) return <div className="p-8 text-center">Staff not found</div>

    return (
        <Container>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/staffs`)
                        }
                    >
                        Back to Staff
                    </Button>
                    <Button
                        variant="solid"
                        icon={<TbEdit />}
                        onClick={() =>
                            navigate(
                                `/restaurants/${restaurantId}/staff/edit/${staff.id}`,
                            )
                        }
                    >
                        Edit Staff
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h3 className="text-2xl font-bold mb-2">
                                {staff.name}
                            </h3>
                            <StaffRoleBadge role={staff.role} />
                        </Card>
                        <Card>
                            <h4 className="mb-4">Contact Information</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <TbMail className="text-gray-500" />
                                    <span>{staff.email}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <h4 className="mb-4">Details</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <TbId className="text-gray-500" />
                                    <span>ID: {staff.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbCalendar className="text-gray-500" />
                                    <span>
                                        Joined:{' '}
                                        {dayjs(staff.created_at).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default StaffDetail
