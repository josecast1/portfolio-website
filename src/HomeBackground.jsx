import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, SpotLight, Text, Text3D, MeshReflectorMaterial, Center } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { useSpring, animated, config } from '@react-spring/three';

const HomeBackground = () => {
  const [selectedMeshName, setSelectedMeshName] = useState(null);

  // Modified Mesh Component with Text and Animations
  const HoverableMesh = ({ position, color, hoverColor, name, floatDelay }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedMeshName === name;

    // Separate springs for different properties for better control
    const { position: animatedPosition } = useSpring({
      position: isSelected ? [position[0], position[1], 2] : [position[0], position[1], 0],
      config: { mass: 1, tension: 180, friction: 12 }
    });

    const { scale } = useSpring({
      scale: isSelected || hovered ? 1.2 : 1,
      config: { mass: 1, tension: 170, friction: 26 }
    });

    useFrame((state, delta) => {
      if (meshRef.current) {
        if (isSelected) {
          // Smooth continuous rotation when selected
          meshRef.current.rotation.y += delta * 2;
        } else {
          // Smoothly return to original rotation
          meshRef.current.rotation.y *= 0.95;
        }
      }
    });

    return (
      <>
        <animated.mesh
          ref={meshRef}
          position={animatedPosition}
          scale={scale}
          castShadow
          receiveShadow
          onClick={() => setSelectedMeshName(isSelected ? null : name)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry />
          <meshStandardMaterial color={isSelected || hovered ? hoverColor : color} />
        </animated.mesh>
        <animated.group position={animatedPosition}>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.4}
            color={isSelected ? 'yellow' : 'white'}
            anchorX="center"
            anchorY="middle"
            font="/Roboto-Bold.ttf"
          >
            {name}
          </Text>
        </animated.group>
      </>
    );
  };

  const Spotlight = ({ targetName }) => {
    if (!targetName) return null;

    const spotlightPositions = {
      About: [-3, 5, 2],
      Projects: [0, 5, 2],
      Contact: [3, 5, 2],
    };

    const [x, y, z] = spotlightPositions[targetName];

    return (
      <SpotLight
        position={[x, y, z]}
        angle={0.5}
        intensity={100}
        penumbra={1}
        distance={8}
        color="white"
        castShadow
        target-position={[x, 0, z]}
      />
    );
  };

  const randomizeFloatDelay = () => Math.random();

  const DraggableText = ({ children, position }) => {
    const rigidBodyRef = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const bodyStart = useRef({ x: 0, y: 0 });
  
    const handlePointerDown = (event) => {
      if (!rigidBodyRef.current) return;
      event.stopPropagation();
      setIsDragging(true);
      
      dragStart.current = { x: event.point.x, y: event.point.y };
      const currentPos = rigidBodyRef.current.translation();
      bodyStart.current = { x: currentPos.x, y: currentPos.y };
      
      rigidBodyRef.current.setGravityScale(0);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    };
  
    const handlePointerMove = (event) => {
      if (!isDragging || !rigidBodyRef.current) return;
      
      const deltaX = event.point.x - dragStart.current.x;
      const deltaY = event.point.y - dragStart.current.y;
      
      const newX = bodyStart.current.x + deltaX;
      const newY = Math.max(-0.5, bodyStart.current.y + deltaY);
      
      const currentPos = rigidBodyRef.current.translation();
      rigidBodyRef.current.setTranslation(
        { x: newX, y: newY, z: currentPos.z },
        true
      );
      
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    };
  
    const handlePointerUp = () => {
      if (!rigidBodyRef.current) return;
      setIsDragging(false);
      rigidBodyRef.current.setGravityScale(1);
    };
  
    return (
      <RigidBody
        ref={rigidBodyRef}
        restitution={0.9}
        friction={0.1}
        position={position}
        colliders="cuboid"
      >
        <Center>
          <Text3D
            curveSegments={32}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.1}
            height={0.5}
            lineHeight={0.5}
            letterSpacing={-0.06}
            size={1.5}
            font="/Inter_Bold.json"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {children}
            <meshNormalMaterial />
          </Text3D>
        </Center>
      </RigidBody>
    );
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color attach="background" args={["#101010"]} />
        <fog attach="fog" args={["#101010", 10, 20]} />

        <Spotlight targetName={selectedMeshName} />

        <Physics gravity={[0, 0, 0]}>
          <DraggableText position={[0, 5, -10]}>Hello my name</DraggableText>
          <DraggableText position={[0, 3, -10]}>is Jose Castro!</DraggableText>
          
          <RigidBody type="fixed">
            <mesh
              receiveShadow={true}
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
          </RigidBody>
        </Physics>

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