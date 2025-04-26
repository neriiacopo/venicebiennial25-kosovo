import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three-stdlib";

function AsciiRenderer({
    bgColor = "black",
    fgColor = "white",
    characters = " .:-+*=%@#",
}) {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef();

    useEffect(() => {
        const effect = new AsciiEffect(gl, characters, { invert: true });
        effect.domElement.style.color = fgColor;
        effect.domElement.style.backgroundColor = bgColor;
        effect.domElement.style.position = "absolute";
        effect.domElement.style.top = "0px";
        effect.domElement.style.left = "0px";
        effect.domElement.style.pointerEvents = "none";
        document.body.appendChild(effect.domElement);
        effect.setSize(size.width, size.height);

        effectRef.current = effect;

        return () => {
            document.body.removeChild(effect.domElement);
        };
    }, [gl, characters, fgColor, bgColor, size]);

    useFrame(() => {
        if (effectRef.current) {
            effectRef.current.render(scene, camera);
        }
    }, 1);

    return null;
}

export default function FxASCII() {
    return (
        <>
            <AsciiRenderer
                fgColor="black"
                bgColor="white"
                characters=" .:-+*=%@#"
            />
        </>
    );
}
