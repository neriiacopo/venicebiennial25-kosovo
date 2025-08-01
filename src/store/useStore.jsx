import { create } from "zustand";

export let useStore = create((set, get) => ({
    ready: false,
    landing: true,
    fxIntro: { landing: 2, app: 1 },
    blurTitle: false,
    db: [],
    scales: ["xs", "m", "xl"],
    scale: "m",
    cameraSettings: [],
    cameraLock: false,
    imgHover: false,
    introY: 0,

    selectedId: null,
    dropNarratives: false,
    narratives: [],
    narrativeIds: [],
    activeNarratives: [],

    noisePattern: null,

    globe: {
        radius: 100,
        center: [0, 100, 0],
        texture: "./black-marble-w-noise.jpg",
    },

    cameraOptions: {
        xl: {
            fov: 60,
            type: "trackball",
            rot: false,
            zoom: false,
            pan: false,
            position: [0, 0, 100],
        },
        m: {
            fov: 30,
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

    startNarrative: (narrative) => {
        const db = get().db;
        const getNarrativeIds = get().getNarrativeIds;
        const setScale = get().setScale;
        const relevantIds = getNarrativeIds(db, narrative);

        const randomId =
            relevantIds[Math.floor(Math.random() * relevantIds.length)];
        const selectedId = relevantIds[0];

        setScale(db[selectedId].section);

        set({
            selectedId: selectedId,
            activeNarratives: [narrative],
            landing: false,
            narrativeIds: relevantIds,
        });
    },

    openEntry: (id) => {
        const db = get().db;
        const getNarrativeIds = get().getNarrativeIds;
        const narratives = get().narratives;

        const activeNarratives = narratives.filter(
            (narrative) => db[id][narrative] != null
        );

        const activeNarrative = activeNarratives[0]; /// Keep only one narrative per time --- DEV

        set({
            selectedId: id,
            dropNarratives: true,
            activeNarratives: activeNarrative,
            narrativeIds: getNarrativeIds(db, activeNarrative),
        });
    },

    closeEntry: () => {
        set({
            selectedId: null,
            activeNarratives: [],
            narrativeIds: [],
        });
    },

    resetLanding: () => {
        set({
            landing: true,
            // blurTitle: true,
            dropNarratives: false,
            introY: 0,
            selectedId: null,
            activeNarratives: [],
        });
    },

    getNarrativeIds: (db, narrative) => {
        const relevantIds = db
            .map((d) => (d[narrative] != null ? d.id : undefined))
            .filter((id) => id !== undefined);

        return relevantIds;
    },

    setScale: (scale) => {
        const options = get().cameraOptions[scale];
        set({
            scale,
            cameraSettings: options,
        });
    },
}));
