import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, SpotLight, Text, Text3D, MeshReflectorMaterial, Center } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { useSpring, animated, config } from '@react-spring/three';

const CameraAnimation = () => {
    const { camera } = useThree();
    
    const { cameraY } = useSpring({
      from: { cameraY: 10 },
      to: { cameraY: 2 },
      delay: 500,
      config: {
        mass: 1,
        tension: 20,
        friction: 15
      }
    });
  
    useFrame(() => {
      camera.position.y = cameraY.get();
      camera.lookAt(0, 0, -400); // Ensure the camera always looks at the origin
    });
  
    return null;
  };

// Separate component for the info panel to prevent unnecessary rerenders
const InfoPanel = ({ name, onClose }) => (
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
    <h3>{name}</h3>
    <p>
      {name === 'About' && 'This is the about section.'}
      {name === 'Projects' && 'Here are some of the projects.'}
      {name === 'Contact' && 'Reach out to us through contact info.'}
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
      onClick={onClose}
    >
      Close
    </button>
  </div>
);

// Individual mesh component with self-contained state
const HoverableMesh = ({ position, color, hoverColor, name, onSelect, selectedName }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
  
    // Determine if this mesh is active based on the selectedName prop
    const active = selectedName === name;
  
    // Self-contained spring animation
    const { scale, positionZ } = useSpring({
      scale: hovered || active ? 1.2 : 1,
      positionZ: active ? 2 : 0,
      config: config.wobbly,
    });
  
    useFrame((state, delta) => {
      if (meshRef.current) {
        if (active) {
          meshRef.current.rotation.y += delta * 1.5;
        } else {
          meshRef.current.rotation.y *= 0.95;
        }
      }
    });
  
    const handleClick = () => {
      onSelect(active ? null : name); // Toggle active state
    };
  
    return (
      <>
        <animated.mesh
          ref={meshRef}
          position-x={position[0]}
          position-y={position[1]}
          position-z={positionZ}
          scale={scale}
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry />
          <meshStandardMaterial color={hovered || active ? hoverColor : color} />
        </animated.mesh>
        <animated.group 
          position-x={position[0]}
          position-y={position[1]}
          position-z={positionZ}
        >
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.4}
            color={active ? 'yellow' : 'white'}
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
  

  const DraggableText = ({ children, position, rotation }) => {
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
        rotation={rotation}
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

const HomeBackground = () => {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 10], fov: 50 }}>
      <CameraAnimation />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color attach="background" args={["#101010"]} />
        <fog attach="fog" args={["#101010", 10, 20]} />

        {selectedName && (
          <SpotLight
            position={[selectedName === 'About' ? -3 : selectedName === 'Projects' ? 0 : 3, 5, 3]}
            angle={0.5}
            intensity={100}
            penumbra={1}
            distance={8}
            color="white"
            castShadow
            target-position={[selectedName === 'About' ? -3 : selectedName === 'Projects' ? 0 : 3, 0, 3]}
          />
        )}

        <Physics gravity={[0, -2, 0]}>
          <DraggableText position={[0, 5, -10]} rotation={[-0.1, -0.2, 0]}>Hello my name</DraggableText>
          <DraggableText position={[0, 3, -10]} rotation={[0.1, 0.2, 0]}>is Jose Castro!</DraggableText>
          
          <RigidBody type="fixed">
            <mesh
              receiveShadow
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

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[-3, 0, 0]} 
                color="blue" 
                hoverColor="lightblue" 
                name="About"
                onSelect={setSelectedName}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[0, 0, 0]} 
                color="green" 
                hoverColor="lightgreen" 
                name="Projects"
                onSelect={setSelectedName}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[3, 0, 0]} 
                color="red" 
                hoverColor="pink" 
                name="Contact"
                onSelect={setSelectedName}
                selectedName={selectedName}
            />
        </Float>
      </Canvas>

      {selectedName && (
        <InfoPanel 
          name={selectedName} 
          onClose={() => setSelectedName(null)} 
        />
      )}
    </div>
  );
};

export default HomeBackground;