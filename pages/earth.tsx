import { OrbitControls, useHelper, useMatcapTexture } from "@react-three/drei";
import { Canvas, MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, Suspense } from "react";
import { Object3D } from "three";
import * as THREE from "three";

const Draw = () => {
  const sunRef = useRef<Object3D>();

  const earthMeshRef = useRef<Object3D>();
  const moonGroupRef = useRef<Object3D>();
  const moonMeshRef = useRef<Object3D>();

  const earth = useControls("earth", {
    scale: {
      min: 0.01,
      max: 0.2,
      step: 0.01,
      value: 0.2,
    },
  });
  const moon = useControls("moon", {
    position: [0.3, 0.1, -0.3],
  });
  const sun = useControls("pointLight", {
    color: "#ffffff",
    position: [-1, 1, 1],
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
      <mesh ref={earthMeshRef} receiveShadow castShadow>
        <sphereGeometry args={[earth.scale, 128, 128]} />
        <meshStandardMaterial map={earthTexture} roughness={1} metalness={0} />
      </mesh>
      <group ref={moonGroupRef}>
        <mesh
          ref={moonMeshRef}
          position={moon.position}
          scale={[0.03, 0.03, 0.03]}
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

const Scene: React.FC = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 1],
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
      <Suspense fallback={null}>
        <Draw />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
