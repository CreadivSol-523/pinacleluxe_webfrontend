import { create } from "zustand";

interface LoaderState {
    isLoading: boolean;
    show: () => void;
    hide: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
    isLoading: false,

    show: () => set({ isLoading: true }),

    hide: () => set({ isLoading: false }),
}));