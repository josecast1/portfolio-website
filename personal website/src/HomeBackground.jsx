import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, PresentationControls, Stage, Float } from "@react-three/drei";

const HomeBackground = () => {
  const dodecahedronRef = useRef();

  // Rotate the dodecahedron on each frame
  useFrame(() => {
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x += 0.01;
      dodecahedronRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <Float
        speed={5} // Animation speed, defaults to 1
        rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[0, 0.2]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Float>

      <Float
        speed={4}
        rotationIntensity={0.5}
        floatIntensity={1.5}
        floatingRange={[0, 0.2]}
      >
      <mesh position={[-3, 0, 0]}>
        <coneGeometry />
        <meshStandardMaterial />
      </mesh>
      </Float>

      <Float
        speed={4}
        rotationIntensity={0.5}
        floatIntensity={1}
        floatingRange={[0, 0.2]}
      >
      <mesh position={[3, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5]}/>
        <meshStandardMaterial />
      </mesh>
      </Float>

      <mesh ref={dodecahedronRef} position={[0, 3, -10]}>
        <dodecahedronGeometry args={[3]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-0.55}>
        <planeGeometry args={[170, 170]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.5}
        />
      </mesh>
    </>
  )
}

export default HomeBackground