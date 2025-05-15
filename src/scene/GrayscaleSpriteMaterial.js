import * as THREE from "three";
import { extend } from "@react-three/fiber";

class GrayscaleSpriteMaterial extends THREE.SpriteMaterial {
    constructor(parameters = {}) {
        super();

        this.uniforms = {
            uTexture: { value: null },
            uGrayscale: { value: 1.0 },
            ...parameters.uniforms,
        };

        this.vertexShader = `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;

        vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

        vec3 alignedPosition = position;
        vec3 cameraRight = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
        vec3 cameraUp    = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);

        mvPosition.xyz += cameraRight * alignedPosition.x;
        mvPosition.xyz += cameraUp    * alignedPosition.y;

        gl_Position = projectionMatrix * mvPosition;
      }
    `;

        this.fragmentShader = `
      uniform sampler2D uTexture;
uniform float uGrayscale;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 finalColor = mix(color.rgb, vec3(gray), uGrayscale);
    
    // Apply gamma correction
    finalColor = pow(finalColor, vec3(1.0/2.2));
    
    gl_FragColor = vec4(finalColor, color.a);
}

    `;

        // Replace the default SpriteMaterial program
        this.onBeforeCompile = (shader) => {
            shader.uniforms.uTexture = this.uniforms.uTexture;
            shader.uniforms.uGrayscale = this.uniforms.uGrayscale;
            shader.vertexShader = this.vertexShader;
            shader.fragmentShader = this.fragmentShader;
        };

        // Make sure the standard texture property still works
        this.map = parameters.map || null;
        this.transparent = true;
        this.depthTest = false;
        this.depthWrite = false;
    }

    get uGrayscale() {
        return this.uniforms.uGrayscale.value;
    }

    set uGrayscale(value) {
        this.uniforms.uGrayscale.value = value;
    }

    get uTexture() {
        return this.uniforms.uTexture.value;
    }

    set uTexture(value) {
        this.uniforms.uTexture.value = value;
    }
}

// Register it for JSX usage
extend({ GrayscaleSpriteMaterial });

export default GrayscaleSpriteMaterial;
