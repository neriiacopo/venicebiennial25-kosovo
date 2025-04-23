import { create } from "zustand";

export let useStore = create((set, get) => ({
    narratives: [],
    db: [],
    selectedId: "",
    scales: ["xs", "m", "xl"],
    scale: "m",
    cameraSettings: [],
    cameraLock: false,
    imgHover: false,
    activeNarratives: [],

    setScale: (scale) => {
        const options = get().cameraOptions[scale];
        set({
            scale,
            cameraSettings: options,
        });
    },

    cameraOptions: {
        xl: {
            fov: 100,
            rot: false,
            zoom: false,
            pan: false,
            position: [0, 0, 100],
        },
        m: {
            fov: 50,
            rot: false,
            zoom: false,
            pan: true,
            position: [0, 0, 100],
        },
        xs: {
            fov: 100,
            rot: true,
            zoom: false,
            pan: false,
            position: [0, 0, 140],
        },
    },
}));
