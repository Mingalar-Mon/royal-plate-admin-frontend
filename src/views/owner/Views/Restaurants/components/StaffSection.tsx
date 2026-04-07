import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import {
    TbUserPlus,
    TbTrash,
    TbUser,
    TbMail,
    TbPhone,
    TbEye,
} from 'react-icons/tb'
import type { Control, FieldErrors } from 'react-hook-form'
import type { RestaurantFormSchema } from '../../CreateRestaurant/types/restaurantForm.types'
import { Input } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

interface Staff {
    id: string
    name: string
    email: string
    role?: string
    phone?: string
    avatar?: string
}

interface StaffSectionProps {
    control: Control<RestaurantFormSchema>
    errors: FieldErrors<RestaurantFormSchema>
    useMockData?: boolean
}

// Mock staff data (will be fetched from backend in real scenario)
export const MOCK_STAFF: Staff[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Manager',
        phone: '+9591234567',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Chef',
        phone: '+9591234568',
    },
    {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'Waiter',
        phone: '+9591234569',
    },
    {
        id: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'Cashier',
        phone: '+9591234570',
    },
    {
        id: '5',
        name: 'Charlie Lee',
        email: 'charlie@example.com',
        role: 'Delivery',
        phone: '+9591234571',
    },
    {
        id: '6',
        name: 'Diana Prince',
        email: 'diana@example.com',
        role: 'Manager',
        phone: '+9591234572',
    },
    {
        id: '7',
        name: 'Ethan Hunt',
        email: 'ethan@example.com',
        role: 'Chef',
        phone: '+9591234573',
    },
    {
        id: '8',
        name: 'Fiona Gallagher',
        email: 'fiona@example.com',
        role: 'Waiter',
        phone: '+9591234574',
    },
]

// Number of staff to show initially (without "See All")
const INITIAL_DISPLAY_COUNT = 3

const StaffSection = ({
    control,
    errors,
    useMockData = true,
}: StaffSectionProps) => {
    const [showAllStaffDialog, setShowAllStaffDialog] = useState(false)
    const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
    const [availableStaff, setAvailableStaff] = useState<Staff[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
    })

    // Fetch staff on component mount
    useEffect(() => {
        const loadStaff = async () => {
            setIsLoading(true)
            try {
                if (useMockData) {
                    setTimeout(() => {
                        setAvailableStaff(MOCK_STAFF)
                        setIsLoading(false)
                        // console.log('Available staff: ', availableStaff)
                    }, 500)
                } else {
                    // TODO: Replace with actual API call
                    // const response = await staffAPI.getAllStaff()
                    // setAvailableStaff(response.data)
                    setAvailableStaff(MOCK_STAFF)
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Failed to fetch staff:', error)
                setIsLoading(false)
            }
        }
        loadStaff()
    }, [useMockData, availableStaff])

    // Filter staff based on search
    const filteredStaff = availableStaff.filter(
        (staff) =>
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Handle adding new staff
    const handleAddStaff = () => {
        if (!newStaff.name || !newStaff.email) {
            toast.push(
                <Notification type="warning">
                    Name and email are required!
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        const staffToAdd: Staff = {
            id: Date.now().toString(),
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            phone: newStaff.phone,
        }

        if (useMockData) {
            setAvailableStaff([...availableStaff, staffToAdd])
        } else {
            // TODO: Call API to create staff
            // await staffAPI.createStaff(staffToAdd)
            setAvailableStaff([...availableStaff, staffToAdd])
        }

        setNewStaff({ name: '', email: '', role: '', phone: '' })
        setShowAddStaffDialog(false)

        toast.push(
            <Notification type="success">
                Staff member added successfully!
            </Notification>,
            { placement: 'top-center' },
        )
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h4>Staff Members</h4>
                    <Button
                        type="button"
                        size="sm"
                        icon={<TbUserPlus />}
                        onClick={() => setShowAddStaffDialog(true)}
                    >
                        Register Staff
                    </Button>
                </div>

                <Controller
                    name="staffIds"
                    control={control}
                    render={({ field }) => {
                        // console.log('Field: ', field)
                        // Get current staff IDs (assigned to this restaurant)
                        const assignedStaffIds = field.value || []
                        // Get full staff objects for assigned staff
                        const assignedStaff = availableStaff.filter((s) => {
                            // console.log('Filtering assigned staff', s)
                            return assignedStaffIds.includes(s.id)
                        })

                        // Show only first INITIAL_DISPLAY_COUNT staff members
                        const displayedStaff = availableStaff.slice(
                            0,
                            INITIAL_DISPLAY_COUNT,
                        )
                        const hasMoreStaff =
                            availableStaff.length > INITIAL_DISPLAY_COUNT

                        return (
                            <FormItem
                                invalid={!!errors.staffIds}
                                errorMessage={errors.staffIds?.message}
                            >
                                <div className="space-y-3">
                                    {availableStaff.length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed rounded-lg">
                                            <TbUser className="mx-auto text-4xl text-gray-400" />
                                            <p className="text-sm text-gray-500 mt-2">
                                                No staff members assigned
                                            </p>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="plain"
                                                onClick={() =>
                                                    setShowAllStaffDialog(true)
                                                }
                                                className="mt-2"
                                            >
                                                Add staff members
                                            </Button>
                                        </div>
                                    )}

                                    {/* Display limited staff members */}
                                    {displayedStaff.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                    <TbUser className="text-primary-600 dark:text-primary-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {staff.name}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <TbMail size={14} />
                                                            {staff.email}
                                                        </span>
                                                        {staff.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <TbPhone
                                                                    size={14}
                                                                />
                                                                {staff.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {staff.role && (
                                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {staff.role}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                size="xs"
                                                icon={<TbTrash />}
                                                variant="plain"
                                                className="text-red-500"
                                                onClick={() => {
                                                    const newIds =
                                                        assignedStaffIds.filter(
                                                            (id) =>
                                                                id !== staff.id,
                                                        )
                                                    field.onChange(newIds)
                                                    toast.push(
                                                        <Notification type="success">
                                                            Staff removed from
                                                            restaurant
                                                        </Notification>,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        },
                                                    )
                                                }}
                                            />
                                        </div>
                                    ))}

                                    {/* See All button */}
                                    {hasMoreStaff && (
                                        <Button
                                            type="button"
                                            variant="plain"
                                            size="sm"
                                            icon={<TbEye />}
                                            onClick={() =>
                                                setShowAllStaffDialog(true)
                                            }
                                            className="w-full"
                                        >
                                            See all {availableStaff.length}{' '}
                                            staff members
                                        </Button>
                                    )}

                                    {/* Add staff button when there are some staff */}
                                    {availableStaff.length > 0 &&
                                        availableStaff.length <=
                                            INITIAL_DISPLAY_COUNT && (
                                            <Button
                                                type="button"
                                                variant="plain"
                                                size="sm"
                                                icon={<TbUserPlus />}
                                                onClick={() =>
                                                    setShowAllStaffDialog(true)
                                                }
                                                className="w-full"
                                            >
                                                Add more staff
                                            </Button>
                                        )}
                                </div>
                            </FormItem>
                        )
                    }}
                />
            </Card>

            {/* See All Staff Dialog - Shows all staff assigned to this restaurant */}
            <Dialog
                isOpen={showAllStaffDialog}
                onClose={() => setShowAllStaffDialog(false)}
                onRequestClose={() => setShowAllStaffDialog(false)}
                width={700}
                title="All Staff Members"
            >
                <div className="p-4">
                    <Controller
                        name="staffIds"
                        control={control}
                        render={({ field }) => {
                            const assignedStaffIds = field.value || []
                            const assignedStaff = availableStaff.filter((s) =>
                                assignedStaffIds.includes(s.id),
                            )

                            return (
                                <>
                                    <div className="mb-4">
                                        <p className="text-gray-600">
                                            Total staff members assigned to this
                                            restaurant:{' '}
                                            <strong>
                                                {assignedStaff.length}
                                            </strong>
                                        </p>
                                    </div>

                                    {assignedStaff.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">
                                                No staff members assigned yet
                                            </p>
                                            <Button
                                                type="button"
                                                variant="solid"
                                                onClick={() => {
                                                    setShowAllStaffDialog(false)
                                                    // Open add staff dialog or show available staff list
                                                }}
                                                className="mt-4"
                                            >
                                                Add Staff Members
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {assignedStaff.map((staff) => (
                                                <div
                                                    key={staff.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                            <TbUser className="text-primary-600 dark:text-primary-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {staff.name}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <TbMail
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    {
                                                                        staff.email
                                                                    }
                                                                </span>
                                                                {staff.phone && (
                                                                    <span className="flex items-center gap-1">
                                                                        <TbPhone
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {
                                                                            staff.phone
                                                                        }
                                                                    </span>
                                                                )}
                                                                {staff.role && (
                                                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                                        {
                                                                            staff.role
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        icon={<TbTrash />}
                                                        variant="plain"
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            const newIds =
                                                                assignedStaffIds.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        staff.id,
                                                                )
                                                            field.onChange(
                                                                newIds,
                                                            )
                                                            toast.push(
                                                                <Notification type="success">
                                                                    Staff
                                                                    removed from
                                                                    restaurant
                                                                </Notification>,
                                                                {
                                                                    placement:
                                                                        'top-center',
                                                                },
                                                            )
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="solid"
                                            icon={<TbUserPlus />}
                                            onClick={() => {
                                                setShowAllStaffDialog(false)
                                                setShowAddStaffDialog(true)
                                            }}
                                        >
                                            Register New Staff
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={() =>
                                                setShowAllStaffDialog(false)
                                            }
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </>
                            )
                        }}
                    />
                </div>
            </Dialog>

            {/* Add New Staff Dialog */}
            <Dialog
                isOpen={showAddStaffDialog}
                onClose={() => setShowAddStaffDialog(false)}
                onRequestClose={() => setShowAddStaffDialog(false)}
                width={500}
                title="Register New Staff"
            >
                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name *
                            </label>
                            <Input
                                value={newStaff.name}
                                onChange={(e) =>
                                    setNewStaff({
                                        ...newStaff,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter staff name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email *
                            </label>
                            <Input
                                value={newStaff.email}
                                onChange={(e) =>
                                    setNewStaff({
                                        ...newStaff,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Enter email address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone (Optional)
                            </label>
                            <Input
                                value={newStaff.phone}
                                onChange={(e) =>
                                    setNewStaff({
                                        ...newStaff,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Role (Optional)
                            </label>
                            <Input
                                value={newStaff.role}
                                onChange={(e) =>
                                    setNewStaff({
                                        ...newStaff,
                                        role: e.target.value,
                                    })
                                }
                                placeholder="e.g., Manager, Chef, Waiter"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => {
                                setShowAddStaffDialog(false)
                                setNewStaff({
                                    name: '',
                                    email: '',
                                    role: '',
                                    phone: '',
                                })
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            onClick={handleAddStaff}
                        >
                            Register Staff
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default StaffSection
