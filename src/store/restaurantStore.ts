import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DialogView = 'CREATE_PROFILE' | 'DELETE_CONFIRM' | ''
interface RestaurantUIState {
    // Dialog state
    isDialogOpen: boolean

    // we store minimal data needed for the dialog
    activeRestaurant: { id: string; name: string } | null

    dialogView: DialogView

    // Action
    openProfileDialog: (
        view: DialogView,
        restaurant: { id: string; name: string },
    ) => void
    closeDialog: () => void

    setActiveRestaurant: (
        restaurant: { id: string; name: string } | null,
    ) => void
}

export const useRestaurantStore = create<RestaurantUIState>()(
    persist(
        (set) => ({
            isDialogOpen: false,
            activeRestaurant: null,
            dialogView: '',

            setActiveRestaurant: (restaurant) =>
                set({ activeRestaurant: restaurant }),

            openProfileDialog: (view, restaurant) =>
                set({
                    isDialogOpen: true,
                    activeRestaurant: restaurant,
                    dialogView: view,
                }),

            closeDialog: () => {
                set({ isDialogOpen: false })

                setTimeout(() => {
                    return set({
                        // isDialogOpen: false,
                        activeRestaurant: null,
                        dialogView: '',
                    })
                }, 300)
            },
        }),
        {
            name: 'royal-plate-restaurant-context',
            partialize: (state) => ({
                activeRestaurant: state.activeRestaurant,
            }),
        },
    ),
)
