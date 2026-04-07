import { create } from 'zustand'
import type { Restaurant, DialogView } from '../ScrumBoard/types'

interface RestaurantState {
    // Data
    restaurants: Restaurant[]
    isLoading: boolean
    error: string | null

    // UI State
    selectedRestaurant: Restaurant | null
    dialogOpen: boolean
    dialogView: DialogView

    // Actions
    setRestaurants: (restaurants: Restaurant[]) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void

    // Dialog actions
    openDialog: (view: DialogView, restaurant?: Restaurant) => void
    closeDialog: () => void

    openModal: (view: DialogView) => void

    // CRUD operations (optimistic updates)
    addRestaurant: (restaurant: Restaurant) => void
    updateRestaurant: (id: string, updatedData: Partial<Restaurant>) => void
    deleteRestaurant: (id: string) => void
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
    // Initial state
    restaurants: [],
    isLoading: false,
    error: null,
    selectedRestaurant: null,
    dialogOpen: false,
    dialogView: '',

    // Basic setters
    setRestaurants: (restaurants) => set({ restaurants }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Dialog management
    openDialog: (view, restaurant = undefined) =>
        set({
            dialogOpen: true,
            dialogView: view,
            selectedRestaurant: restaurant,
        }),
    closeDialog: () =>
        set({
            dialogOpen: false,
            dialogView: '',
            selectedRestaurant: null,
        }),

    openModal: (view) =>
        set({
            dialogOpen: true,
            dialogView: view,
        }),

    // Optimistic updates (UI updates instantly, API calls happen in background)
    addRestaurant: (restaurant) =>
        set((state) => ({
            restaurants: [restaurant, ...state.restaurants],
        })),

    updateRestaurant: (id, updatedData) =>
        set((state) => ({
            restaurants: state.restaurants.map((restaurant) =>
                restaurant.id === id
                    ? { ...restaurant, ...updatedData }
                    : restaurant,
            ),
        })),

    deleteRestaurant: (id) =>
        set((state) => ({
            restaurants: state.restaurants.filter((r) => r.id !== id),
        })),
}))
