import { useEffect, useState, useRef } from "react";

import { useStore } from "../store/useStore.jsx";

import { useControls } from "leva";

export default function DevControllers() {
    const updateFov = useStore((state) => state.updateFov);

    const spriteSh = useControls("", {
        spritBw: true,
    });

    const textures = [
        "./countries_inv.jpg",
        "./countries.jpg",
        "./black-marble-w-noise.jpg",
        "./black-marble-noise.jpg",
        "./blue-marble.jpg",
    ];

    const texturesSelector = useControls("", {
        globeTextureId: {
            value: 0,
            min: 0,
            max: textures.length - 1,
            step: 1,
        },
    });

    const fovs = useControls("", {
        fov_xl: {
            value: 40,
            min: 30,
            max: 100,
        },
        fov_m: {
            value: 50,
            min: 30,
            max: 100,
        },
        fov_xs: {
            value: 100,
            min: 30,
            max: 100,
        },
    });

    useEffect(() => {
        useStore.setState((state) => ({
            spriteBw: spriteSh.spritBw,
        }));
    }, [spriteSh]);

    useEffect(() => {
        console.log(textures[texturesSelector.globeTextureId]);
        const texturePath = textures[texturesSelector.globeTextureId];
        if (texturePath !== null) {
            useStore.setState((state) => ({
                globe: {
                    ...state.globe,
                    texture: texturePath,
                },
            }));
        }
    }, [texturesSelector]);

    useEffect(() => {
        const keys = Object.keys(fovs);
        keys.map((key) => {
            const scale = key.split("_")[1]; // xl, m, xs
            const fov = fovs[key];
            if (useStore.getState().cameraOptions[scale].fov === fov) return;

            useStore.setState((state) => ({
                cameraOptions: {
                    ...state.cameraOptions,
                    [scale]: {
                        ...state.cameraOptions[scale],
                        fov: fov,
                    },
                },
            }));
            updateFov();
        });
    }, [fovs]);

    return null;
}
