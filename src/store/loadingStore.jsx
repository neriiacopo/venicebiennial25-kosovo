// store/loadingStore.js
import { create } from "zustand";

export const useLoadingStore = create((set) => ({
    dataProgress: 0,
    setDataProgress: (v) => set({ dataProgress: v }),
}));
