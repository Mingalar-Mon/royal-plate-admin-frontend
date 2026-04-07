import apiClient from './client'

export const restaurantAPI = {
    // Get all restaurants
    getRestaurants: () => apiClient.get('/restaurant/owner'),

    // Get single restaurant by ID
    getRestaurant: (id: string) =>
        apiClient.get(`/restaurant/get-restaurant/${id}`),

    // Create new restaurant
    createRestaurant: (data: any) =>
        apiClient.post(`/restaurant/create-restaurant`, data),

    // Update restaurant
    updateRestaurant: (id: string, data: any) =>
        apiClient.patch(`/restaurant/update-restaurant/${id}`, data),

    // Delete restaurant
    deleteRestaurant: (id: string) =>
        apiClient.delete(`/restaurant/delete-restaurant/${id}`),

    // Get all cuisines
    getCuisines: () => apiClient.get(`/cuisines`),

    // Get all payment methods
    getPaymentMethods: () => apiClient.get(`/payment-methods`),
}
