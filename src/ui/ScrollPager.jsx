import { useEffect, useState, useRef } from "react";

import { useStore } from "../store/useStore";

export default function ScrollPager() {
    const scales = useStore.getState().scales;
    const scale = useStore.getState().scale;
    const setScale = useStore((state) => state.setScale);

    const [sectionIdx, setSectionIdx] = useState(scales.indexOf(scale));
    const isThrottled = useRef(false);
    const scrollBuffer = useRef(0); // To increase threshold for scroll sensitivity
    const scrollTreshold = 200;

    const handleScroll = (event) => {
        scrollBuffer.current += event.deltaY;

        if (isThrottled.current) return;

        if (Math.abs(scrollBuffer.current) >= scrollTreshold) {
            isThrottled.current = true;

            // Pause after scrolling (do we need it?)
            setTimeout(() => {
                isThrottled.current = false;
            }, 0);

            setSectionIdx((prev) => {
                if (scrollBuffer.current > 0 && prev < 2) {
                    scrollBuffer.current = 0; // Reset after triggering
                    return prev + 1;
                }
                if (scrollBuffer.current < 0 && prev > 0) {
                    scrollBuffer.current = 0;
                    return prev - 1;
                }
                scrollBuffer.current = 0; // Reset if boundary is reached
                return prev;
            });
        }
    };

    // Change Scale if scroll is successfull
    useEffect(() => {
        setScale(scales[sectionIdx]);
    }, [sectionIdx]);

    // Catch Scroll event
    useEffect(() => {
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, []);

    return null;
}
