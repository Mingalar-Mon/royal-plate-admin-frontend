import type { Cuisine } from '@/views/cuisines/types/cuisine.type'

export const mockCuisines: Cuisine[] = [
    {
        id: '1',
        name: 'Italian',
        image: 'https://picsum.photos/id/1/200/150',
        description: 'Pizza, Pasta, Risotto, and more',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
    },
    {
        id: '2',
        name: 'Japanese',
        image: 'https://picsum.photos/id/2/200/150',
        description: 'Sushi, Ramen, Tempura',
        createdAt: '2025-02-15T14:20:00Z',
        updatedAt: '2025-02-15T14:20:00Z',
    },
    {
        id: '3',
        name: 'Mexican',
        image: 'https://picsum.photos/id/3/200/150',
        description: 'Tacos, Burritos, Quesadillas',
        createdAt: '2025-03-20T09:30:00Z',
        updatedAt: '2025-03-20T09:30:00Z',
    },
]
