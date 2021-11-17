import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, Suspense } from "react";
import { Object3D } from "three";
import * as THREE from "three";

const Draw = () => {
  const lightRef1 = useRef<Object3D>();
  const lightRef2 = useRef<Object3D>();
  const lightGroupRef = useRef<Object3D>();

  const meshRef = useRef<Object3D>();

  const torus = useControls("torus", {
    size: {
      min: 0.01,
      max: 1,
      step: 0.01,
      value: 0.4,
    },
    radius: {
      min: 0.01,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
    metalness: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
    roughness: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
    textureRepeatX: {
      min: 1,
      max: 10,
      step: 1,
      value: 5,
    },
    textureRepeatY: {
      min: 1,
      max: 10,
      step: 1,
      value: 1,
    },
    displacementScale: {
      min: 0,
      max: 0.1,
      step: 0.001,
      value: 0.01,
    },
  });
  const light1 = useControls("light1", {
    color: "#00ebad",
    position: [0, 1, 0],
    intensity: {
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 1,
    },
  });
  const light2 = useControls("light2", {
    color: "#ffffff",
    position: [-1, 0, 0],
    intensity: {
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 1,
    },
  });
  const ambient = useControls("ambient", {
    intensity: {
      min: 0.1,
      max: 1,
      step: 0.1,
      value: 0.2,
    },
  });

  const [texture, normal, displacement] = useLoader(THREE.TextureLoader, [
    "textures/angled-shale-cliff_albedo.png",
    "textures/angled-shale-cliff_normal-ogl.png",
    "textures/angled-shale-cliff_height.png",
  ]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const lightGroup = lightGroupRef.current;

    const time = clock.getElapsedTime();
    const t = Math.cos(time);

    mesh.rotation.x = time * 0.02;
    mesh.rotation.y = time * 0.05;

    lightGroup.rotation.x = time * 0.3;
    lightGroup.rotation.y = time * 0.2;
  });

  //   useHelper(lightRef1, THREE.PointLightHelper, 0.1);
  //   useHelper(lightRef2, THREE.PointLightHelper, 0.1);

  return (
    <>
      <ambientLight color="white" intensity={ambient.intensity} />
      <group ref={lightGroupRef}>
        <pointLight
          ref={lightRef1}
          color={light1.color}
          intensity={light1.intensity}
          position={light1.position}
          castShadow
        />
        <pointLight
          ref={lightRef2}
          color={light2.color}
          intensity={light2.intensity}
          position={light2.position}
          castShadow
        />
      </group>
      <mesh ref={meshRef}>
        <torusGeometry
          args={[torus.size, (torus.size * torus.radius) / 2, 128, 128]}
        />
        <meshStandardMaterial
          map={texture}
          displacementScale={torus.displacementScale}
          displacementMap={displacement}
          normalMap={normal}
          metalness={torus.metalness}
          roughness={torus.roughness}
          onUpdate={(self) => {
            // Wrap seamlessly
            self.map.wrapS = THREE.RepeatWrapping;
            self.map.wrapT = THREE.RepeatWrapping;
            self.map.repeat.set(torus.textureRepeatX, torus.textureRepeatY);

            self.normalMap.wrapS = THREE.RepeatWrapping;
            self.normalMap.wrapT = THREE.RepeatWrapping;
            self.normalMap.repeat.set(
              torus.textureRepeatX,
              torus.textureRepeatY
            );

            self.displacementMap.wrapS = THREE.RepeatWrapping;
            self.displacementMap.wrapT = THREE.RepeatWrapping;
            self.displacementMap.repeat.set(
              torus.textureRepeatX,
              torus.textureRepeatY
            );
          }}
        />
      </mesh>
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
