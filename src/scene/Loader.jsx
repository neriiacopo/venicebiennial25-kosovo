import { useProgress, Html } from "@react-three/drei";
import { useLoadingStore } from "../store/loadingStore";

export default function Loader() {
    const { progress: dreiProgress } = useProgress();
    const dataProgress = useLoadingStore((s) => s.dataProgress);

    // Weighted or simple average:
    const combined = Math.round(dataProgress * 0.6 + dreiProgress * 0.4);

    return (
        <Html center>
            <div>loading {combined}%</div>
        </Html>
    );
}
