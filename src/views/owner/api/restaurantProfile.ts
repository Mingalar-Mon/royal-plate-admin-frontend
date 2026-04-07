import apiClient from './client'
import type { RestaurantProfile } from '@/views/restaurant-profile/types/restaurantProfile.types'

export const restaurantProfileAPI = {
    // Get profile by restaurant ID
    getProfileByRestaurantId: (restaurantId: string) =>
        apiClient.get(`/restaurant/profile/get-profile/${restaurantId}`),

    // Create new profile
    createProfile: (restaurantId: string, data: any) =>
        apiClient.post(
            `/restaurant/profile/create-profile/${restaurantId}`,
            data,
        ),

    // Update profile
    updateProfile: (profileId: string, data: any) =>
        apiClient.patch(
            `/restaurant/profile/update-profile/${profileId}`,
            data,
        ),

    // Delete profile
    deleteProfile: (profileId: string) =>
        apiClient.delete(`/restaurant/profile/delete-profile/${profileId}`),

    // Get all cuisines
    getAllCuisines: () => apiClient.get('/cuisines/get-all-cuisines'),

    // Get all payment methods
    getAllPaymentMethods: () =>
        apiClient.get('/payment-methods/get-all-payment-methods'),
}
