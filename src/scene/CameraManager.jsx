import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore.jsx";
import gsap from "gsap";

import { latLonToXYZ } from "../utils.js";

const pristina = { lat: 42.6026, lon: 20.9029 };

export default function CameraController() {
    const { camera, pointer } = useThree();
    const cameraSettings = useStore((state) => state.cameraSettings);
    const cameraLock = useStore((state) => state.cameraLock);
    const selectedId = useStore((state) => state.selectedId);
    const scale = useStore((state) => state.scale);

    const globe = useStore((state) => state.globe); // globe or map

    const cameraSpeed = useRef({ value: 0 });

    const targetRotation = useRef({ x: 0, y: 0 });
    const targetPan = useRef({ x: 0, y: 0 });
    const targetAngle = useStore((state) => state.birdCenter);

    const centerTrackBall = useStore((state) => state.birdCenter);
    const currentAngle = useRef({ lon: 0, lat: 0 });

    // Initial camera position
    useEffect(() => {
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    // Handle FOV changes
    useEffect(() => {
        targetPan.current = { x: 0, y: 0 };
        targetRotation.current = { x: 0, y: 0 };
        if (cameraSettings.fov !== undefined) {
            gsap.to(camera.position, {
                duration: 2,
                ease: "power2.out",
                x: cameraSettings.position[0],
                y: cameraSettings.position[1],
                z: cameraSettings.position[2],
                onUpdate: () => {
                    camera.lookAt(0, 0, 0);
                },
            });
            gsap.to(camera, {
                duration: 2,
                fov: cameraSettings.fov,
                onUpdate: () => {
                    camera.updateProjectionMatrix();
                },
            });

            // Speed
            cameraSpeed.current.value = 0;
            gsap.to(cameraSpeed.current, {
                value: 1,
                duration: 2,
                ease: "power2.in",
                onUpdate: () => {},
            });
        }
    }, [cameraSettings]);

    // Reset camera position on scale change
    useEffect(() => {
        targetPan.current = { x: 0, y: 0 };
        targetRotation.current = { x: 0, y: 0 };
        currentAngle.current = { lon: 0, lat: 0 };
    }, [scale]);

    // Reset speed on selection
    useEffect(() => {
        if (!selectedId) {
            // Speed
            cameraSpeed.current.value = 0;
            gsap.to(cameraSpeed.current, {
                value: 1,
                duration: 2,
                ease: "power2.in",
                onUpdate: () => {},
            });
        }
    }, [selectedId]);

    // Slow down on hover
    // useEffect(() => {
    //     if (cameraLock) {
    //         gsap.to(cameraSpeed.current, {
    //             value: 0.01,
    //             duration: 0.5,
    //             ease: "power2.out",
    //             onUpdate: () => {},
    //         });
    //     } else {
    //         gsap.to(cameraSpeed.current, {
    //             value: 1,
    //             duration: 1,
    //             ease: "power2.in",
    //             onUpdate: () => {},
    //         });
    //     }
    // }, [cameraLock]);

    // Animate camera movements based on mouse with inertia
    useFrame((state, delta) => {
        if (cameraLock) return; // Skip updates if camera is locked
        // Limited first person view - rotation
        if (cameraSettings.type === "firstPerson") {
            // target rotation range in radians
            const maxX = 0.2;
            const maxY = 0.5;

            const targetX = pointer.y * maxX;
            const targetY = pointer.x * maxY;

            // Smoothly interpolate (inertia)
            targetRotation.current.x +=
                (targetX - targetRotation.current.x) *
                0.05 *
                cameraSpeed.current.value;
            targetRotation.current.y +=
                (targetY - targetRotation.current.y) *
                0.05 *
                cameraSpeed.current.value;

            // Apply rotation
            camera.rotation.x = targetRotation.current.x;
            camera.rotation.y = -targetRotation.current.y;
        }

        // Constrained flying control - pan
        if (cameraSettings.type === "flyover") {
            const maxPanX = 100;
            const maxPanY = 100;

            // Calculate new pan target
            const targetX = pointer.x * maxPanX;
            const targetY = pointer.y * maxPanY;

            // Lerp to new pan values (inertia)
            targetPan.current.x +=
                (targetX - targetPan.current.x) *
                0.02 *
                cameraSpeed.current.value;
            targetPan.current.y +=
                (targetY - targetPan.current.y) *
                0.02 *
                cameraSpeed.current.value;

            // Apply to camera position while keeping Z fixed
            camera.position.set(
                targetPan.current.x,
                targetPan.current.y,
                camera.position.z
            );
        }

        if (cameraSettings.type === "trackball") {
            const pivot = {
                x: globe.center[0],
                y: globe.center[2],
                z: -globe.center[1],
            };
            const radius = globe.radius * 1.8;

            const targetLon = centerTrackBall.lat;
            const targetLat = centerTrackBall.lon;

            const targetX = -pointer.x;
            const targetY = pointer.y;

            // Smoothly interpolate (inertia)
            currentAngle.current.lon +=
                (targetLon - currentAngle.current.lon) *
                    0.02 *
                    cameraSpeed.current.value -
                targetX * 0.5 * cameraSpeed.current.value;

            currentAngle.current.lat +=
                (targetLat - currentAngle.current.lat) *
                    0.02 *
                    cameraSpeed.current.value +
                targetY * 0.5 * cameraSpeed.current.value;

            const destination = [
                pivot.x +
                    radius *
                        Math.cos(degToRad(currentAngle.current.lat)) *
                        Math.cos(degToRad(90 - currentAngle.current.lon)),
                pivot.y + radius * Math.sin(degToRad(currentAngle.current.lat)),
                pivot.z +
                    radius *
                        Math.cos(degToRad(currentAngle.current.lat)) *
                        Math.sin(degToRad(90 - currentAngle.current.lon)),
            ];

            camera.position.set(destination[0], destination[1], destination[2]);
            camera.lookAt(0, 0, -100);
        }
    });

    return null;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}
