import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Subtle wavy plane on top of the scene in the background
function WavyPlane() {
  const mesh = useRef()
  const geometry = useMemo(() => new THREE.PlaneGeometry(150, 100, 20, 20), [])

  useFrame(({ clock }) => {
    const positions = geometry.attributes.position.array
    const time = clock.elapsedTime * 0.5

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      positions[i + 2] = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 2
    }
    geometry.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={mesh} position={[0, 15, -10]} rotation={[Math.PI /2, 0, 0]}>
      <primitive object={geometry} />
      <meshBasicMaterial 
        color="#112154" 
        transparent 
      />
    </mesh>
  )
};

export default WavyPlane;