import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const HomeBackground = () => {
  const [hoveredMesh, setHoveredMesh] = useState(null); // Track hovered mesh
  const [selectedMesh, setSelectedMesh] = useState(null); // Track selected mesh
  const [targetPosition, setTargetPosition] = useState(null); // Target camera position
  const [initialCameraPosition, setInitialCameraPosition] = useState(null); // Initial camera position

  // Mesh Component
  const HoverableMesh = ({ position, color, hoverColor, name }) => {
    const meshRef = useRef();

    return (
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHoveredMesh(meshRef.current)}
        onPointerLeave={() => setHoveredMesh(null)}
        onClick={() => {
          setSelectedMesh(name);
          setTargetPosition([position[0], position[1], position[2] + 2]); // Adjust the Z distance
        }}
      >
        <boxGeometry />
        <meshStandardMaterial color={hoveredMesh === meshRef.current ? hoverColor : color} />
      </mesh>
    );
  };

  // Camera movement logic
  const CameraController = () => {
    const { camera } = useThree();

    useEffect(() => {
      // Store the initial camera position
      if (!initialCameraPosition) {
        setInitialCameraPosition(camera.position.clone());
      }
    }, [camera, initialCameraPosition]);

    useFrame(() => {
      if (targetPosition) {
        const target = new THREE.Vector3(...targetPosition);
        camera.position.lerp(target, 0.1); // Smoothly move camera
        camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2]); // Ensure the camera looks at the mesh
      } else if (initialCameraPosition) {
        // Reset camera to its initial position
        camera.position.lerp(initialCameraPosition, 0.1);
        camera.lookAt(0, 0, 0); // Reset to center look-at point
      }
    });

    return null;
  };

  return (
    <div style={{ height: '100vh', position: 'relative', backgroundColor: 'black' }}>
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Floating and Hoverable Meshes */}
        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
          <HoverableMesh position={[-3, 0, 0]} color="blue" hoverColor="lightblue" name="About" />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
          <HoverableMesh position={[0, 0, 0]} color="green" hoverColor="lightgreen" name="Projects" />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
          <HoverableMesh position={[3, 0, 0]} color="red" hoverColor="pink" name="Contact" />
        </Float>

        {/* Camera Controller */}
        <CameraController />
      </Canvas>

      {/* Info Panel */}
      {selectedMesh && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
          }}
        >
          <h3>{selectedMesh}</h3>
          <p>
            {selectedMesh === 'About' && 'This is the about section.'}
            {selectedMesh === 'Projects' && 'Here are some of the projects.'}
            {selectedMesh === 'Contact' && 'Reach out to us through contact info.'}
          </p>
          <button
            style={{
              marginTop: '10px',
              backgroundColor: 'gray',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedMesh(null);
              setTargetPosition(null); // Reset camera target
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeBackground;
