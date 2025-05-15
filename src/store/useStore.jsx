import { create } from "zustand";

export let useStore = create((set, get) => ({
    narratives: [],
    db: [],
    selectedId: null,
    scales: ["xs", "m", "xl"],
    scale: "m",
    cameraSettings: [],
    cameraLock: false,
    imgHover: false,
    activeNarratives: [],

    globe: { radius: 100, center: [0, 100, 0], texture: "./countries_inv.jpg" },

    setScale: (scale) => {
        const options = get().cameraOptions[scale];
        set({
            scale,
            cameraSettings: options,
        });
    },

    cameraOptions: {
        xl: {
            fov: 40,
            type: "trackball",
            rot: false,
            zoom: false,
            pan: false,
            position: [0, 0, 100],
        },
        m: {
            fov: 50,
            type: "flyover",
            rot: false,
            zoom: false,
            pan: true,
            position: [0, 0, 100],
        },
        xs: {
            fov: 100,
            type: "firstPerson",
            rot: true,
            zoom: false,
            pan: false,
            position: [0, 0, 140],
        },
    },

    // DEV stuff

    spriteBw: true,
    updateFov: () => {
        const scale = get().scale;
        const options = get().cameraOptions[scale];
        set({
            cameraSettings: options,
        });
    },
}));
