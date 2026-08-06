import type { Blog } from '@/views/blogs/types/blog.type'

export const mockBlogs: Blog[] = [
    {
        id: '1',
        title: 'Welcome to Our New Location!',
        content:
            'We are excited to announce the opening of our second branch...',
        imageUrls: [
            'https://picsum.photos/id/1/800/400',
            'https://picsum.photos/id/2/800/400',
        ],
        restaurantId: 'mock-rest-id',
        authorOwner: { id: 'owner1', name: 'John Owner' },
        viewCount: 150,
        createdAt: '2025-05-01T10:00:00Z',
        updatedAt: '2025-05-01T10:00:00Z',
    },
    {
        id: '2',
        title: 'New Menu Item: Spicy Ramen',
        content:
            'Try our latest creation – a fiery bowl of ramen made with organic ingredients...',
        imageUrls: ['https://picsum.photos/id/3/800/400'],
        restaurantId: 'mock-rest-id',
        authorStaff: { id: 'staff1', name: 'Chef Alice', role: 'chef' },
        linkedDish: { id: 'dish1', name: 'Spicy Ramen', price: 12000 },
        viewCount: 89,
        createdAt: '2025-05-10T14:30:00Z',
        updatedAt: '2025-05-10T14:30:00Z',
    },
]
