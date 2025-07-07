import { useEffect, useState, useRef } from "react";

import { useStore } from "../store/useStore";

export default function PageScroller({ scroll }) {
    const introH = useStore((state) => state.introH);
    const scales = useStore.getState().scales;
    const scale = useStore.getState().scale; // why??
    const setScale = useStore((state) => state.setScale);
    const selectedId = useStore((state) => state.selectedId);
    const fxIntro = useStore((state) => state.fxIntro);

    const [sectionIdx, setSectionIdx] = useState(scales.indexOf(scale));
    const isThrottled = useRef(false);
    const scrollS = useRef(0); // To increase threshold for scroll sensitivity

    const scrollY = useRef(0); // To increase threshold for scroll sensitivity
    const scrollTreshold = 1000;

    const handleScroll = (event) => {
        if (scroll) {
            scrollY.current += event.deltaY * 0.5;

            if (scrollY.current < 0) {
                scrollY.current = 0;
            }

            const scrollYCentered = scrollY.current + window.innerHeight; // use center of screen as reference

            const visThreshold = scrollYCentered - introH;
            const stopY = introH - window.innerHeight;

            if (visThreshold >= 0) {
                useStore.setState({ introY: stopY });
                scrollY.current = stopY;

                useStore.setState({ landing: false });

                setTimeout(() => {
                    useStore.setState({ dropNarratives: true });
                }, fxIntro.app * 2000);
            } else {
                useStore.setState({ introY: scrollY.current });
            }
        }
        if (!scroll) {
            scrollS.current += event.deltaY;

            if (isThrottled.current) return;

            if (Math.abs(scrollS.current) >= scrollTreshold) {
                isThrottled.current = true;

                // Pause after scrolling (do we need it?)
                setTimeout(() => {
                    isThrottled.current = false;
                }, 10);

                setSectionIdx((prev) => {
                    if (scrollS.current > 0 && prev < 2) {
                        scrollS.current = 0; // Reset after triggering
                        return prev + 1;
                    }
                    if (scrollS.current < 0 && prev > 0) {
                        scrollS.current = 0;
                        return prev - 1;
                    }
                    scrollS.current = 0; // Reset if boundary is reached
                    return prev;
                });
            }
        }
    };

    // Reset scroll on change landing
    useEffect(() => {
        if (scroll && scrollY.current != 0) {
            scrollY.current = 0; // Reset scroll position
        }
    }, [scroll]);

    // Change Scale if scroll is successfull
    useEffect(() => {
        setScale(scales[sectionIdx]);
    }, [sectionIdx]);

    useEffect(() => {
        if (selectedId) return;
        if (introH === 0) return;

        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [selectedId, scroll, introH]);

    return null;
}
