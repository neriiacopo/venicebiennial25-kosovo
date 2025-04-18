import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore.jsx";
import gsap from "gsap";

export default function CameraController() {
    const { camera, pointer } = useThree();
    const cameraSettings = useStore((state) => state.cameraSettings);
    const cameraLock = useStore((state) => state.cameraLock);

    const targetRotation = useRef({ x: 0, y: 0 });
    const targetPan = useRef({ x: 0, y: 0 });

    // Fixed camera position
    useEffect(() => {
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    // Handle FOV changes
    useEffect(() => {
        if (cameraSettings.fov !== undefined) {
            gsap.to(camera.position, {
                duration: 1,
                x: cameraSettings.position[0],
                y: cameraSettings.position[1],
                z: cameraSettings.position[2],
                onUpdate: () => {
                    camera.lookAt(0, 0, 0);
                },
            });
            gsap.to(camera, {
                duration: 1,
                fov: cameraSettings.fov,
                onUpdate: () => {
                    camera.updateProjectionMatrix();
                },
            });
        }
    }, [cameraSettings]);

    useEffect(() => {
        // targetPan.current = { x: 0, y: 0 };
        // targetRotation.current = { x: 0, y: 0 };
    }, [cameraLock]);

    // Animate camera movements based on mouse with inertia
    useFrame(() => {
        // Limited first person view - rotation
        if (cameraLock === false) {
            if (cameraSettings.rot) {
                // target rotation range in radians
                const maxX = 0.2; // pitch (up/down)
                const maxY = 0.5; // yaw (left/right)

                const targetX = pointer.y * maxX;
                const targetY = pointer.x * maxY;

                // Smoothly interpolate (inertia)
                targetRotation.current.x +=
                    (targetX - targetRotation.current.x) * 0.05;
                targetRotation.current.y +=
                    (targetY - targetRotation.current.y) * 0.05;

                // Apply rotation
                camera.rotation.x = targetRotation.current.x;
                camera.rotation.y = -targetRotation.current.y;
            }

            // Constrained flying control - pan
            if (cameraSettings.pan) {
                const maxPanX = 100;
                const maxPanY = 100;

                // Calculate new pan target
                const targetX = pointer.x * maxPanX;
                const targetY = pointer.y * maxPanY;

                // Lerp to new pan values (inertia)
                targetPan.current.x += (targetX - targetPan.current.x) * 0.02;
                targetPan.current.y += (targetY - targetPan.current.y) * 0.02;

                // Apply to camera position while keeping Z fixed
                camera.position.set(
                    targetPan.current.x,
                    targetPan.current.y,
                    camera.position.z
                );
            }
        }
    });

    return null;
}
