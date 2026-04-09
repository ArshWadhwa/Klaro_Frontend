import { create } from 'zustand';

interface SidebarStore {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  collapseSidebar: () => set({ isCollapsed: true }),
  expandSidebar: () => set({ isCollapsed: false }),
}));
