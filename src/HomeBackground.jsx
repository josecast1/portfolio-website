import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, SpotLight, Text, Text3D, MeshReflectorMaterial, Center } from '@react-three/drei';

const HomeBackground = () => {
  const [selectedMeshName, setSelectedMeshName] = useState(null); // Track selected mesh by name

  // Mesh Component with Text
  const HoverableMesh = ({ position, color, hoverColor, name, floatDelay }) => {
    const meshRef = useRef();

    return (
      <>
        <mesh
          ref={meshRef}
          position={position}
          castShadow={true} // Ensure the mesh casts shadows
          receiveShadow={true} // Ensures the mesh receives shadows
          onClick={() => setSelectedMeshName(selectedMeshName === name ? null : name)}
        >
          <boxGeometry />
          <meshStandardMaterial color={selectedMeshName === name ? hoverColor : color} />
        </mesh>
        <Text
          position={[position[0], position[1] + 1.2, position[2]]}
          fontSize={0.4}
          color={selectedMeshName === name ? 'yellow' : 'white'}
          anchorX="center"
          anchorY="middle"
          font="/Roboto-Bold.ttf"
        >
          {name}
        </Text>
      </>
    );
  };

  // Spotlight Component
  const Spotlight = ({ targetName }) => {
    if (!targetName) return null;

    // Spotlight positions based on mesh names
    const spotlightPositions = {
      About: [-3, 5, 0],
      Projects: [0, 5, 0],
      Contact: [3, 5, 0],
    };

    const [x, y, z] = spotlightPositions[targetName];

    return (
      <SpotLight
        position={[x, y, z]} // Position directly above the selected mesh
        angle={0.5}
        intensity={100}
        penumbra={1}
        distance={8}
        color="white"
        castShadow // Ensure spotlight casts shadows
        target-position={[x, 0, z]} // Directly shine downward at the mesh's base position
      />
    );
  };

  // Generate random float delays to stagger mesh animations
  const randomizeFloatDelay = () => Math.random() ;

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 10], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color attach="background" args={["#101010"]} />
        <fog attach="fog" args={["#101010", 10, 20]} />

        {/* Spotlight */}
        <Spotlight targetName={selectedMeshName} />

        {/* Plane for Shadows */}
        <mesh
          receiveShadow={true} // Ensure floor receives shadows
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.8, 0]}
        >
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

        {/* Welcome Text */}
        <Center top position={[0, 3, -20]}>
        <Float
          speed={7}
          rotationIntensity={0.2}
          floatIntensity={2}
        >
          <Text3D
            position={[-2, 3, 0]}
            rotation={[0, 0, 0]}
            curveSegments={32}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.1}
            height={0.5}
            lineHeight={0.5}
            letterSpacing={-0.06}
            size={1.5}
            font="/Inter_Bold.json"
          >
            Hello my name
            <meshNormalMaterial />
          </Text3D>
          <Text3D
            position={[-2, 1, 0]}
            rotation={[0, 0, 0]}
            curveSegments={32}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.1}
            height={0.5}
            lineHeight={0.5}
            letterSpacing={-0.06}
            size={1.5}
            font="/Inter_Bold.json"
          >
            is Jose Castro!
            <meshNormalMaterial />
          </Text3D>
        </Float>
        </Center>

        {/* Floating and Hoverable Meshes with Randomized Float Delays */}
        <Float speed={4} rotationIntensity={0.5} floatIntensity={1} floatDelay={randomizeFloatDelay()}>
          <HoverableMesh position={[-3, 0, 0]} color="blue" hoverColor="lightblue" name="About" />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1} floatDelay={randomizeFloatDelay()}>
          <HoverableMesh position={[0, 0, 0]} color="green" hoverColor="lightgreen" name="Projects" />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1} floatDelay={randomizeFloatDelay()}>
          <HoverableMesh position={[3, 0, 0]} color="red" hoverColor="pink" name="Contact" />
        </Float>
      </Canvas>

      {/* Info Panel */}
      {selectedMeshName && (
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
          <h3>{selectedMeshName}</h3>
          <p>
            {selectedMeshName === 'About' && 'This is the about section.'}
            {selectedMeshName === 'Projects' && 'Here are some of the projects.'}
            {selectedMeshName === 'Contact' && 'Reach out to us through contact info.'}
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
            onClick={() => setSelectedMeshName(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeBackground;
