import * as THREE from "three";
import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { InstancedMesh, MathUtils, Object3D } from "three";
import { useControls } from "leva";
import { random16 } from "three/src/math/MathUtils";
import * as random from "maath/random";

console.log(random);

const lerp = THREE.MathUtils.lerp;
const DIMENSIONS = 3;

interface Particle {
  px: number;
  py: number;
  pz: number;
  posX: number;
  posY: number;
  posZ: number;
  noise: number;
}

// generate two sets of 4 points in a circle, that we'll use for our circumcircle visualization
const points = random.inCircle(new Float32Array(4 * 2), { radius: 1 });

function Swarm({ grid, ...props }) {
  const instance = useRef<InstancedMesh>();
  const group = useRef<Object3D>();
  const light = useRef<Object3D>();
  const r1 = useRef<Object3D>();
  const r2 = useRef<Object3D>();
  const r3 = useRef<Object3D>();
  const [dummy] = useState(() => new THREE.Object3D());

  const controls = useControls({
    color: "#000",
    roughness: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.6,
    },
    metalness: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
    light1Intensity: {
      min: 1,
      max: 200,
      step: 1,
      value: 50,
    },
    light2Intensity: {
      min: 1,
      max: 200,
      step: 1,
      value: 10,
    },
    light3Intensity: {
      min: 1,
      max: 200,
      step: 1,
      value: 10,
    },
  });

  const particles = useMemo(() => {
    const temp: Particle[] = [];
    for (let x = 0; x < grid; x++) {
      const px = x / (grid - 1);
      for (let y = 0; y < grid; y++) {
        const py = y / (grid - 1);
        for (let z = 0; z < grid; z++) {
          const pz = z / (grid - 1);
          const noise = random.noise.perlin3(px, py, pz);

          temp.push({
            px,
            py,
            pz,
            posX: lerp(-1, 1, px),
            posY: lerp(-1, 1, py),
            posZ: lerp(-1, 1, pz),
            noise: noise,
          });
        }
      }
    }
    return temp;
  }, [grid]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const loop = Math.sin((Math.PI / 2) * time * 0.1);

    particles.forEach((particle, i) => {
      const { px, py, pz, posX, posY, posZ, noise } = particle;

      const MULTIPLIER = 3;

      const scalar = Math.abs(noise) * MULTIPLIER;

      dummy.position.x = posX;
      dummy.position.y = posY;
      dummy.position.z = posZ;

      dummy.scale.x = Math.max(0.1, px);
      dummy.scale.y = Math.max(0.1, py);
      dummy.scale.z = Math.max(0.1, pz);

      dummy.rotation.x = Math.PI * px * loop;
      dummy.rotation.y = Math.PI * px * loop;
      dummy.rotation.z = Math.PI * py * noise * loop;

      dummy.scale.setScalar(scalar);
      dummy.updateMatrix();
      instance.current.setMatrixAt(i, dummy.matrix);
    });

    light.current.rotation.z = Math.PI * loop * 3;

    light.current.children[0].intensity = controls.light1Intensity;
    light.current.children[1].intensity = controls.light2Intensity;
    light.current.children[2].intensity = controls.light3Intensity;

    group.current.rotation.y = Math.PI * loop;
    group.current.rotation.x = Math.PI * loop;
    instance.current.instanceMatrix.needsUpdate = true;
  });

  const MAX = 1 / (grid - 1);

  //   useHelper(r1, THREE.SpotLightHelper, "red");
  //   useHelper(r2, THREE.SpotLightHelper, "green");
  //   useHelper(r3, THREE.SpotLightHelper, "blue");

  return (
    <>
      <group ref={group}>
        <instancedMesh
          ref={instance}
          args={[null, null, Math.pow(grid, DIMENSIONS)]}
          castShadow
          receiveShadow
          {...props}
        >
          <boxGeometry args={[MAX, MAX, MAX]} />

          <meshStandardMaterial
            roughness={controls.roughness}
            metalness={controls.metalness}
            color={controls.color}
            side={THREE.DoubleSide}
          />
        </instancedMesh>
      </group>
      <group ref={light}>
        <spotLight
          ref={r1}
          color="gold"
          position={[3, 0, 0]}
          intensity={10}
          castShadow
        />
        <spotLight
          ref={r2}
          color="white"
          position={[0, 3, 0]}
          intensity={10}
          castShadow
        />
        <spotLight
          ref={r3}
          color="green"
          position={[0, 0, 3]}
          intensity={10}
          castShadow
        />
      </group>
    </>
  );
}

export default function App() {
  const controls = useControls({
    grid: {
      min: 3,
      max: 20,
      step: 1,
      value: 15,
    },
  });

  return (
    <Canvas
      camera={{
        position: [2, 2, 2],
        near: -1,
        far: 100,
        top: -100,
        left: -100,
        right: 100,
        bottom: 100,
        zoom: 300,
      }}
      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      }}
      orthographic
    >
      <color attach="background" args={["#000000"]} />
      <Swarm grid={controls.grid} position={[0, 0, 0]} />
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>
      <OrbitControls />
      {/* <gridHelper /> */}
    </Canvas>
  );
}
