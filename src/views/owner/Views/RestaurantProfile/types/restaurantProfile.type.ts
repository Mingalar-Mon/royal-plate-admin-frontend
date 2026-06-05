import { z } from 'zod'

// Enums and Types
export interface Cuisine {
    id: string
    name: string
    description?: string
}

export interface PaymentMethod {
    id: string
    name: string
    icon?: string
}

export interface Restaurant {
    id: string
    name: string
    address: string
    staringPrice: string
    endingPrice: string
    longitude: number
    latitude: number
    websiteUrl: string
    imageUrls: string[]
}
export interface RestaurantProfile {
    id: string
    description: string
    openingHour: number
    closingHour: number
    contactNumber: string
    websiteUrl: string
    parking: boolean
    dressCode?: string
    accessibility?: string
    cuisines: Cuisine[]
    paymentMethods: PaymentMethod[]
    // restaurantId: string
    restaurant: Restaurant
}

// Mock data for cuisines (will come from backend)
export const MOCK_CUISINES: Cuisine[] = [
    { id: '1', name: 'Italian', description: 'Pasta, Pizza, Risotto' },
    { id: '2', name: 'Chinese', description: 'Dim Sum, Noodles, Rice' },
    { id: '3', name: 'Japanese', description: 'Sushi, Ramen, Tempura' },
    { id: '4', name: 'Thai', description: 'Curry, Pad Thai, Tom Yum' },
    { id: '5', name: 'Indian', description: 'Curry, Tandoori, Biryani' },
    { id: '6', name: 'Mexican', description: 'Tacos, Burritos, Quesadillas' },
    { id: '7', name: 'French', description: 'Pastry, Bistro, Fine Dining' },
    { id: '8', name: 'Korean', description: 'BBQ, Kimchi, Bibimbap' },
    { id: '9', name: 'Vietnamese', description: 'Pho, Banh Mi, Spring Rolls' },
    { id: '10', name: 'American', description: 'Burgers, BBQ, Steak' },
]

// Mock data for payment methods
export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: '1', name: 'Cash', icon: '💰' },
    { id: '2', name: 'Credit Card', icon: '💳' },
    { id: '3', name: 'Debit Card', icon: '💳' },
    { id: '4', name: 'Mobile Payment', icon: '📱' },
    { id: '5', name: 'PayPal', icon: '🅿️' },
    { id: '6', name: 'Bank Transfer', icon: '🏦' },
    { id: '7', name: 'Crypto', icon: '₿' },
]

// Validation Schema
export const restaurantProfileValidationSchema = z
    .object({
        description: z
            .string()
            .min(20, 'Description must be at least 20 characters')
            .max(1000, 'Description cannot exceed 1000 characters'),
        openingHour: z
            .number()
            .min(0, 'Invalid hour')
            .max(1439, 'Invalid hour'),
        closingHour: z
            .number()
            .min(0, 'Invalid hour')
            .max(1439, 'Invalid hour'),
        contactNumber: z
            .string()
            .min(8, 'Contact number is required')
            .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number format'),
        websiteUrl: z
            .string()
            .url('Invalid URL format')
            .optional()
            .or(z.literal('')),
        parking: z.boolean(),
        dressCode: z.string().optional(),
        accessibility: z.string().optional(),
        cuisineIds: z.array(z.string()).min(1, 'Select at least one cuisine'),
        paymentMethodIds: z
            .array(z.string())
            .min(1, 'Select at least one payment method'),
    })
    .refine(
        (data) => {
            // Validate that closing hour is after opening hour
            if (data.closingHour <= data.openingHour) {
                return false
            }
            return true
        },
        {
            message: 'Closing time must be after opening time',
            path: ['closingHour'],
        },
    )

export type RestaurantProfileFormSchema = z.infer<
    typeof restaurantProfileValidationSchema
>
