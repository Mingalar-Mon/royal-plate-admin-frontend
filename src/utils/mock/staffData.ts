import type { RestaurantStaff } from '../types/staff.types'

export const mockStaff: RestaurantStaff[] = [
    {
        id: '1',
        name: 'John Manager',
        email: 'john@restaurant.com',
        role: 'manager',
        restaurantId: 'mock-rest-id',
        createdAt: '2025-01-10T09:00:00Z',
        updatedAt: '2025-01-10T09:00:00Z',
    },
    {
        id: '2',
        name: 'Alice Chef',
        email: 'alice@restaurant.com',
        role: 'chef',
        restaurantId: 'mock-rest-id',
        createdAt: '2025-02-15T10:30:00Z',
        updatedAt: '2025-02-15T10:30:00Z',
    },
    {
        id: '3',
        name: 'Bob Cashier',
        email: 'bob@restaurant.com',
        role: 'cashier',
        restaurantId: 'mock-rest-id',
        createdAt: '2025-03-20T14:00:00Z',
        updatedAt: '2025-03-20T14:00:00Z',
    },
    {
        id: '4',
        name: 'Eve Staff',
        email: 'eve@restaurant.com',
        role: 'staff',
        restaurantId: 'mock-rest-id',
        createdAt: '2025-04-01T08:15:00Z',
        updatedAt: '2025-04-01T08:15:00Z',
    },
]
