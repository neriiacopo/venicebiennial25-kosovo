import { useMemo } from "react";

function simpleSeededRandom(seed) {
    return () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
}

export default function StylizedCharacters({
    label,
    percentage = 0.2,
    styleSet = null,
    seed = 1,
}) {
    const chars = label.split("");
    const styledCount = Math.floor(chars.length * percentage);

    const rand = simpleSeededRandom(seed);
    const rand2 = simpleSeededRandom(seed + chars.length);

    const styledIndices = useMemo(() => {
        const indices = [...Array(chars.length).keys()];
        indices.sort(() => rand() - 0.5);

        return new Set(indices.slice(0, styledCount));
    }, [label, percentage, seed]);

    if (styleSet == null) {
        const sets = ["ss01", "ss02", "ss03", "ss04"];
        styleSet = sets[Math.floor(rand2() * sets.length)];
    }

    //// Dev utility to highlight styles
    // const colors = ["blue", "red", "yellow", "purple"];
    // let color = "";
    // if (styleSet == null) {
    //     const sets = ["ss01", "ss02", "ss03", "ss04"];
    //     styleSet = sets[Math.floor(rand2() * sets.length)];
    //     color = colors[Math.floor(rand2() * sets.length)];
    // } else {
    //     color = "gray";
    // }

    return (
        <>
            {chars.map((char, i) => (
                <span
                    key={i}
                    style={
                        styledIndices.has(i)
                            ? {
                                  fontFeatureSettings: `"${styleSet}" 1`,
                                  //   color: color,
                              }
                            : undefined
                    }
                >
                    {char}
                </span>
            ))}
        </>
    );
}
