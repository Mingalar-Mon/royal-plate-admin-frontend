import type { Reservation } from '@/views/reservations/types/reservation.type'

export const mockReservations: Reservation[] = [
    {
        id: '1',
        reservationDate: '2025-05-15',
        startingTime: '2025-05-15T19:00:00Z',
        endingTime: '2025-05-15T21:00:00Z',
        status: 'confirmed',
        remark: 'Window seat preferred',
        user: {
            id: 'u1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '0912345678',
        },
        dishes: [
            { id: 'd1', name: 'Margherita Pizza', price: 12000 },
            { id: 'd2', name: 'Caesar Salad', price: 7000 },
        ],
        table: { id: 't1', type: 'Booth', capacity: 4 },
        createdAt: '2025-05-10T10:00:00Z',
        updatedAt: '2025-05-10T10:00:00Z',
    },
    {
        id: '2',
        reservationDate: '2025-05-16',
        startingTime: '2025-05-16T18:30:00Z',
        endingTime: '2025-05-16T20:30:00Z',
        status: 'pending',
        remark: '',
        user: { id: 'u2', name: 'Jane Smith', phone: '0998765432' },
        dishes: [
            { id: 'd1', name: 'Margherita Pizza', price: 12000 },
            { id: 'd2', name: 'Caesar Salad', price: 7000 },
        ],
        table: { id: 't2', type: 'Standard', capacity: 2 },
        createdAt: '2025-05-11T14:20:00Z',
        updatedAt: '2025-05-11T14:20:00Z',
    },
    {
        id: '3',
        reservationDate: '2025-05-14',
        startingTime: '2025-05-14T20:00:00Z',
        endingTime: '2025-05-14T22:00:00Z',
        status: 'complete',
        remark: 'Birthday celebration',
        user: { id: 'u3', name: 'Alice Brown', email: 'alice@example.com' },
        dishes: [
            { id: 'd1', name: 'Margherita Pizza', price: 12000 },
            { id: 'd2', name: 'Caesar Salad', price: 7000 },
        ],
        table: { id: 't3', type: 'Private', capacity: 8 },
        createdAt: '2025-05-12T09:15:00Z',
        updatedAt: '2025-05-14T22:00:00Z',
    },
]
