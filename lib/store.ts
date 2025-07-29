import { create } from "zustand"

interface AppState {
  isDrawerOpen: boolean
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}))
