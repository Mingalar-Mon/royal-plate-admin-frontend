// import { Restaurant } from '@/@types/restaurant'
import { Dish } from '@/views/order/types/order.type'

export type Owner = {
    id: string
    name: string
    email: string
}

export type Staff = {
    id: string
    name: string
    email: string
}

export type Cuisine = {
    id: string
    name: string
    description?: string
}

export type PaymentMethod = {
    id: string
    name: string
    logoImage?: { key: string; url: string }
}

export type RestaurantProfile = {
    id: string
    description: string
    openingHour: number
    closingHour: number
    contactNumber: string
    websiteUrl?: string | undefined
    parking: boolean
    dressCode?: string
    accessibility?: string
    // cuisines: Cuisine[]
    // paymentMethods: PaymentMethod[]
    // // restaurantId: string
    // restaurant: Restaurant
}

export type CreateRestaurantProfile = Omit<RestaurantProfile, 'id'>

export type Restaurant = {
    id: string
    name: string
    address: string
    images: {
        key: string
        url: string
    }[]
    logoImage: {
        key: string
        url: string
    }
    startingPrice: number
    endingPrice: number
    tax: number
    latitude: number | null
    longitude: number | null
    // owner and staff aren't needed for fetching restaurant or restaurants
    owner: Owner
    staff: Array<Staff>
    profile: RestaurantProfile | null
}

export type GetRestaurantResponse = {
    success: boolean
    data: Restaurant & Owner & Array<Staff>
    message: string
}
export type GetRestaurantListResponse = {
    success: boolean
    // data: Array<Restaurant & Owner & Array<Staff>>
    data: Restaurant[]
    message: string
}

// Gotta fix this later
export type CreateRestaurantResponse = {
    success: boolean
    data: Restaurant[]
    message: string
}

export type DeleteRestaurantResponse = {
    success: boolean
    data: Restaurant
    message: string
}

export type UpdateRestaurantResponse = DeleteRestaurantResponse

export type GetDishListResponse = {
    success: boolean
    data: Dish[]
    message: string
}
