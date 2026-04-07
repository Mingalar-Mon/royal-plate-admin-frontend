import { create } from 'zustand'

interface DialogState {
    isOpen: boolean
    data?: any
    openDialog: (data?: any) => void
    closeDialog: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
    isOpen: false,
    data: null,
    openDialog: (data) =>
        set({
            isOpen: true,
            data,
        }),
    closeDialog: () =>
        set({
            isOpen: false,
            data: null,
        }),
}))
