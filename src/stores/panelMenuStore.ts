import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelMenuState {
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
  toggleMinimized: () => void;
}

export const usePanelMenuStore = create<PanelMenuState>()(
  persist(
    (set) => ({
      isMinimized: false,
      setIsMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
      toggleMinimized: () =>
        set((state) => ({ isMinimized: !state.isMinimized })),
    }),
    {
      name: "panel-menu-storage",
    },
  ),
);
