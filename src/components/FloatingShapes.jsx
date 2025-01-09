import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating cubes paths in background
function FloatingShapes() {
  const cubeCount1 = 100;
  const cubeCount2 = 50;
  const cubeCount3 = 50;

  const cubeMesh1 = useRef();
  const cubeMesh2 = useRef();
  const cubeMesh3 = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    // Cube movement 1
    for (let i = 0; i < cubeCount1; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.sin(t * 0.4) * 15 + Math.sin(t * 0.3) * 4,  // X-axis
        Math.cos(t * 0.8) * 3 + Math.sin(t * 0.2) * 2,  // Y-axis
        Math.cos(t * 1.2) * 10 + Math.sin(t * 0.6) * 5   // Z-axis
      );
      dummy.rotation.x = dummy.rotation.y = t;
      dummy.updateMatrix();
      cubeMesh1.current.setMatrixAt(i, dummy.matrix);
    }

    // Cube movement 2
    for (let i = 0; i < cubeCount2; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.cos(t * 0.5) * 12 + Math.sin(t * 0.3) * 25,
        Math.cos(t * 0.8) * 5 + Math.tan(t * 0.4) * 3,
        Math.sin(t * 1.5) * 7 + Math.cos(t * 0.6) * 4
      );
      dummy.rotation.x = dummy.rotation.y = t;
      dummy.updateMatrix();
      cubeMesh2.current.setMatrixAt(i, dummy.matrix);
    }

    // Cube movement 3
    for (let i = 0; i < cubeCount3; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.sin(t * 0.3) * 35 + Math.cos(t * 0.5) * 5,
        Math.cos(t * 0.5) * 7 + Math.sin(t * 0.3) * 3,
        Math.sin(t * 0.7) * 12 + Math.cos(t * 1.2) * 6
      );
      dummy.rotation.x = dummy.rotation.y = t;
      dummy.updateMatrix();
      cubeMesh3.current.setMatrixAt(i, dummy.matrix);
    }

    // Update the matrices for the meshes
    cubeMesh1.current.instanceMatrix.needsUpdate = true;
    cubeMesh2.current.instanceMatrix.needsUpdate = true;
    cubeMesh3.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>

      <instancedMesh ref={cubeMesh1} args={[null, null, cubeCount1]} position={[0, 5, -40]} rotation={[0, 3, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#1a9fca" />
      </instancedMesh>


      <instancedMesh ref={cubeMesh2} args={[null, null, cubeCount2]} position={[0, 5, -40]} rotation={[0, 3, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#15be2c" />
      </instancedMesh>


      <instancedMesh ref={cubeMesh3} args={[null, null, cubeCount3]} position={[0, 5, -40]} rotation={[0, 3, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#be1515" />
      </instancedMesh>
    </group>
  );
};

export default FloatingShapes;