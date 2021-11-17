import { OrbitControls, useHelper, useMatcapTexture } from "@react-three/drei";
import { Canvas, MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, Suspense } from "react";
import { Object3D, PointLightHelper } from "three";
import * as THREE from "three";

const Draw = () => {
  const sunRef = useRef<Object3D>();

  const earthMeshRef = useRef<Object3D>();
  const moonGroupRef = useRef<Object3D>();
  const moonMeshRef = useRef<Object3D>();

  const earth = useControls("earth", {
    position: [0, 0, 0],
  });
  const moon = useControls("moon", {
    position: [2, 1, -2],
  });
  const sun = useControls("pointLight", {
    color: "#ffffff",
    position: [-2, 2, 2],
    intensity: {
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 1,
    },
  });

  const [earthTexture, moonTexture] = useLoader(THREE.TextureLoader, [
    "textures/earth.jpg",
    "textures/moon.jpg",
  ]);

  useFrame(({ clock }) => {
    const earth = earthMeshRef.current;
    const moon = moonMeshRef.current;
    const moonGroup = moonGroupRef.current;

    const time = clock.getElapsedTime();
    const t = Math.cos(time);

    earth.rotation.y = time * 0.1;
    moon.rotation.y = time * 0.4;
    moonGroup.rotation.y = time * 0.2;
  });

  // useHelper(sunRef, THREE.PointLightHelper, 0.1);

  return (
    <>
      <pointLight
        ref={sunRef}
        color={sun.color}
        intensity={sun.intensity}
        position={sun.position}
        castShadow
      />
      <mesh
        ref={earthMeshRef}
        position={earth.position}
        receiveShadow
        castShadow
      >
        <sphereGeometry />
        <meshStandardMaterial map={earthTexture} roughness={1} metalness={0} />
      </mesh>
      <group ref={moonGroupRef}>
        <mesh
          ref={moonMeshRef}
          position={moon.position}
          scale={[0.1, 0.1, 0.1]}
          receiveShadow
          castShadow
        >
          <sphereGeometry />
          <meshStandardMaterial map={moonTexture} roughness={1} metalness={0} />
        </mesh>
      </group>

      <OrbitControls />
    </>
  );
};

const Base: React.FC = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
      }}
      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      }}
      onCreated={(state) => {
        state.gl.setClearColor("black");
      }}
    >
      {/* <gridHelper /> */}
      <Suspense fallback="lads">
        <Draw />
      </Suspense>
    </Canvas>
  );
};

export default Base;
