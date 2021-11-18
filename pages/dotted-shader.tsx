import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, Suspense } from "react";
import * as THREE from "three";

import { extend } from "@react-three/fiber";
import vertex from "../shaders/simple.vert";
import frag from "../shaders/dotted.frag";

const DottedMaterial = shaderMaterial(
  { color: new THREE.Color("#295a72"), time: 0, modulo: 10 },
  vertex,
  frag
);

extend({
  DottedMaterial,
});

const Draw = () => {
  const meshRef = useRef<Object3D>();
  const materialRef = useRef<Object3D>();

  const shader = useControls({
    color: "#295a72",
    modulo: {
      min: 1,
      max: 50,
      value: 25,
      step: 1,
    },
  });

  useFrame(({ clock }) => {
    const material = materialRef.current;
    const mesh = meshRef.current;

    const time = clock.getElapsedTime();

    material.color = new THREE.Color(shader.color);
    material.modulo = shader.modulo;
    material.time = time;

    mesh.rotation.x = Math.PI / 4;
    mesh.rotation.y = Math.PI / 4;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <boxGeometry />
        <dottedMaterial ref={materialRef} attach="material" />
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
