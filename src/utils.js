import * as THREE from "three";

export function positionOnSphere(radius = 5, offset = 0) {
    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [x, y, z];
}

export function generateXYZ(size = 10) {
    const pts = [];
    for (let z = -90; z <= 90; z += size) {
        for (let x = -180; x <= 180; x += size) {
            pts.push([x, 0, z]);
        }
    }

    return pts;
}

export function getRandomPointOnGeometry(geometry, count = 10) {
    const posAttr = geometry.attributes.position;
    const uvAttr = geometry.attributes.uv;
    const indexAttr = geometry.index;

    const positions = [];

    for (let i = 0; i < count; i++) {
        // Pick a random triangle from the geometry
        const faceIndex = Math.floor(Math.random() * (indexAttr.count / 3));
        const a = indexAttr.getX(faceIndex * 3);
        const b = indexAttr.getX(faceIndex * 3 + 1);
        const c = indexAttr.getX(faceIndex * 3 + 2);

        // Barycentric coordinates
        let r1 = Math.random();
        let r2 = Math.random();
        if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
        }
        const r3 = 1 - r1 - r2;

        // Interpolate position
        const ax = posAttr.getX(a),
            ay = posAttr.getY(a),
            az = posAttr.getZ(a);
        const bx = posAttr.getX(b),
            by = posAttr.getY(b),
            bz = posAttr.getZ(b);
        const cx = posAttr.getX(c),
            cy = posAttr.getY(c),
            cz = posAttr.getZ(c);

        const x = r1 * ax + r2 * bx + r3 * cx;
        const y = r1 * ay + r2 * by + r3 * cy;
        const z = r1 * az + r2 * bz + r3 * cz;

        positions.push([x, y, z]);
    }

    return positions;
}

const degToRad = (degrees) => degrees * (Math.PI / 180);

export function latLonToXYZ(
    p,
    radius = 100,
    center = [0, 0, 0],
    rotation = [90, 0, 0]
) {
    const polar = [
        radius *
            Math.cos(degToRad(p[0] - rotation[0])) *
            Math.cos(degToRad(p[2] - rotation[2])),
        radius *
            Math.sin(degToRad(p[0] - rotation[0])) *
            Math.cos(degToRad(p[2] - rotation[2])),
        radius * Math.sin(degToRad(p[2] - rotation[2])),
    ];
    const moved = polar.map((p, i) => {
        return p + center[i];
    });
    return moved;
}

export function mirrorPt(p, plane = [x, y, z]) {
    return p.map((coord, i) =>
        plane[i] != null ? plane[i] - (coord - plane[i]) : coord
    );
}

export function interpolateTriple(a, b, c, u) {
    // Remap u into [0, 1] range
    if (u < 0.5) {
        return a.map((_, i) => THREE.MathUtils.lerp(a[i], b[i], u * 2));
    } else {
        return b.map((_, i) => THREE.MathUtils.lerp(b[i], c[i], (u - 0.5) * 2));
    }
}
