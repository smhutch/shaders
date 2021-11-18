import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, Suspense } from "react";
import { Object3D } from "three";

import { extend } from "@react-three/fiber";
import vertex from "../shaders/simple.vert";
import frag from "../shaders/simple.frag";

const ColorShiftMaterial = shaderMaterial({ time: 0, offset: 0 }, vertex, frag);

extend({
  ColorShiftMaterial,
});

const Draw = () => {
  const meshRef = useRef<Object3D>();
  const materialRef = useRef<Object3D>();

  const shader = useControls({
    offset: {
      min: 0.01,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
  });

  // const c = new THREE.Color(shader.color);
  // console.log(c);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    const mesh = meshRef.current;

    const time = clock.getElapsedTime();

    material.time = time;
    material.offset = shader.offset;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry />
        <colorShiftMaterial
          ref={materialRef}
          attach="material"
          color="hotpink"
        />
      </mesh>
    </>
  );
};

const Scene: React.FC = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 2],
      }}
    >
      <Suspense fallback={null}>
        <Draw />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
