import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";

// Platform check
const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function PageScroller({ scroll }) {
    const introH = useStore((s) => s.introH);
    const scales = useStore.getState().scales;
    const scale = useStore.getState().scale;
    const setScale = useStore((s) => s.setScale);
    const selectedId = useStore((s) => s.selectedId);
    const fxIntro = useStore((s) => s.fxIntro);

    const [sectionIdx, setSectionIdx] = useState(scales.indexOf(scale));
    const isThrottled = useRef(false);
    const scrollY = useRef(0);
    const scrollS = useRef(0);
    const scrollThreshold = 1000;

    const rAFScrollDelta = useRef(0);
    const isAnimating = useRef(false);

    const triggerScrollUpdate = (delta) => {
        if (scroll) {
            scrollY.current += delta * 0.5;
            scrollY.current = Math.max(scrollY.current, 0);

            const offFactor = 1.25;
            const scrollYCentered =
                scrollY.current + window.innerHeight * offFactor;
            const visThreshold = scrollYCentered - introH;
            const stopY = introH - window.innerHeight * offFactor;

            if (visThreshold >= 0) {
                useStore.setState({ introY: stopY, landing: false });
                scrollY.current = stopY;

                setTimeout(() => {
                    useStore.setState({ dropNarratives: true });
                }, fxIntro.app * 2000);
            } else {
                useStore.setState({ introY: scrollY.current });
            }
        } else {
            scrollS.current += delta;

            if (isThrottled.current) return;

            if (Math.abs(scrollS.current) >= scrollThreshold) {
                isThrottled.current = true;
                setTimeout(() => (isThrottled.current = false), 300);

                setSectionIdx((prev) => {
                    if (scrollS.current > 0 && prev < scales.length - 1) {
                        scrollS.current = 0;
                        return prev + 1;
                    }
                    if (scrollS.current < 0 && prev > 0) {
                        scrollS.current = 0;
                        return prev - 1;
                    }
                    scrollS.current = 0;
                    return prev;
                });
            }
        }
    };

    const handleScroll = (e) => {
        e.preventDefault();

        const delta = e.deltaY;

        if (isMac && isSafari) {
            rAFScrollDelta.current += delta * 0.1;
        } else {
            triggerScrollUpdate(delta);
        }
    };

    const animateScroll = () => {
        if (!isAnimating.current) return;

        if (Math.abs(rAFScrollDelta.current) > 0.5) {
            const delta = rAFScrollDelta.current;
            rAFScrollDelta.current *= 0.1; // friction

            triggerScrollUpdate(delta);
        } else {
            rAFScrollDelta.current = 0;
        }

        requestAnimationFrame(animateScroll);
    };

    useEffect(() => {
        if (selectedId || introH === 0) return;

        window.addEventListener("wheel", handleScroll, { passive: false });

        if (isMac && isSafari && !isAnimating.current) {
            isAnimating.current = true;
            requestAnimationFrame(animateScroll);
        }

        return () => {
            window.removeEventListener("wheel", handleScroll);
            isAnimating.current = false;
        };
    }, [scroll, introH, selectedId]);

    useEffect(() => {
        setScale(scales[sectionIdx]);
    }, [sectionIdx]);

    useEffect(() => {
        if (scroll && scrollY.current !== 0) scrollY.current = 0;
    }, [scroll]);

    return null;
}
