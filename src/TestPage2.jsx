import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, SpotLight, Text, Text3D, MeshReflectorMaterial, Center, useGLTF } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three'

import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'


const CameraAnimation = () => {
    const { camera } = useThree();
    
    const { cameraY } = useSpring({
      from: { cameraY: 10 },
      to: { cameraY: 2 },
      delay: 0,
      config: {
        mass: 1,
        tension: 20,
        friction: 15
      }
    });
  
    useFrame(() => {
      camera.position.y = cameraY.get();
      camera.lookAt(0, -4000, -100000); // Ensure the camera always looks at the origin
    });
  
    return null;
  };

// Separate component for the info panel to prevent unnecessary rerenders
const InfoPanel = ({ name, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  const content = {
    About: (
      <>
        <p>
          I'm Jose Castro, a Computer Science student at the University of Florida. Passionate about creating
          meaningful tech solutions, with experience in web development, game design, and community leadership.
        </p>
      </>
    ),
    Projects: (
      <>
        <ul className="list-disc pl-5">
          <li>
            <strong>Steam Wrapped Website:</strong> A web app integrating Steam profiles for tracking and
            visualizing game achievements using React, Flask, and MongoDB.
          </li>
          <li>
            <strong>Perfect Pigment:</strong> A 3D first-person platformer developed in Unity showcasing custom
            assets and engaging gameplay mechanics.
          </li>
        </ul>
      </>
    ),
    Contact: (
      <>
        <p>Email: <span className="text-gray-300">josecastro3249@gmail.com</span></p>
        <p>
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/josecastro01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            linkedin.com/in/josecastro01
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/josecast1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            github.com/josecast1
          </a>
        </p>
        <p>Phone: <span className="text-gray-300">(305)-728-9492</span></p>
      </>
    ),
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isClosing ? "animate-scale-out" : "animate-scale-in"
      } pointer-events-none`}
    >
      <div
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 rounded-lg shadow-2xl max-w-md pointer-events-auto transform transition-transform duration-300 ease-in-out"
      >
        <h3 className="text-2xl font-semibold mb-4 text-center border-b border-gray-700 pb-2">
          {name}
        </h3>
        {content[name] || <p>No additional information available for this section.</p>}
        <button
          className="mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};


// Individual mesh component with self-contained state
const HoverableMesh = ({ position, color, hoverColor, name, onSelect, selectedName }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const rotationRef = useRef(0); // Track the current rotation
  
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
        // When active, continue rotating and track the rotation
        rotationRef.current += delta * 1.5;
        meshRef.current.rotation.y = rotationRef.current;
      } else {
        // When inactive, smoothly interpolate back to the nearest forward-facing position
        const targetRotation = Math.round(rotationRef.current / (Math.PI * 2)) * (Math.PI * 2);
        rotationRef.current = THREE.MathUtils.lerp(
          rotationRef.current,
          targetRotation,
          0.1
        );
        meshRef.current.rotation.y = rotationRef.current;
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
  

  const ColorChangingMaterial = () => {
    const [springProps, api] = useSpring(() => ({
      from: { color1: '#ff0000', color2: '#0000ff' },
      to: async (next) => {
        while (true) {
          await next({ color1: '#ff0000', color2: '#0000ff' })
          await next({ color1: '#00ff00', color2: '#ff0000' })
          await next({ color1: '#0000ff', color2: '#00ff00' })
        }
      },
      config: { duration: 2000 },
    }));
  
    return (
      <animated.meshPhongMaterial
        attach="material"
        color={springProps.color1}
        emissive={springProps.color2}
        shininess={70}
      />
    );
  };
  
  const DraggableText = ({ children, position, rotation }) => {
    const words = children.split(' ');
    const characterWidth = 1;
    const minWordSpacing = 2;
  
    const totalWidth = words.reduce((acc, word, index) => {
      const wordWidth = word.length * characterWidth;
      const spaceWidth = index < words.length - 1 ? minWordSpacing : 0;
      return acc + wordWidth + spaceWidth;
    }, 0);
  
    const startX = position[0] - totalWidth / 2;
  
    return (
      <>
        {words.map((word, index) => {
          const previousWordsWidth = words
            .slice(0, index)
            .reduce((acc, prevWord) => {
              return acc + (prevWord.length * characterWidth) + minWordSpacing;
            }, 0);
  
          const wordPosition = [
            startX + previousWordsWidth + (word.length * characterWidth / 2),
            position[1],
            position[2]
          ];
  
          return (
            <DraggableWord
              key={`${word}-${index}`}
              position={wordPosition}
              rotation={rotation}
            >
              {word}
            </DraggableWord>
          );
        })}
      </>
    );
  };
  
  const DraggableWord = ({ children, position, rotation }) => {
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
            <ColorChangingMaterial />
          </Text3D>
        </Center>
      </RigidBody>
    );
  };

// Floating cubes and other shapes in the far background
function FloatingShapes() {
  const cubeCount1 = 100;
  const cubeCount2 = 50; // Number of spheres
  const cubeCount3 = 50; // Number of cylinders

  const cubeMesh1 = useRef();
  const cubeMesh2 = useRef();
  const cubeMesh3 = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    // Cube movement 1
    for (let i = 0; i < cubeCount1; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.sin(t * 0.4) * 15 + Math.sin(t * 0.3) * 4,  // X-axis: Moves back and forth, combined with a swirling effect
        Math.cos(t * 0.8) * 3 + Math.sin(t * 0.2) * 2,  // Y-axis: Moves up/down with additional sway
        Math.cos(t * 1.2) * 10 + Math.sin(t * 0.6) * 5   // Z-axis: Moves back and forth, more variation
      );
      dummy.rotation.x = dummy.rotation.y = t;
      dummy.updateMatrix();
      cubeMesh1.current.setMatrixAt(i, dummy.matrix);
    }

    // Cube movement 2
    for (let i = 0; i < cubeCount2; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.cos(t * 0.5) * 12 + Math.sin(t * 0.3) * 25,  // X-axis: Slight variation
        Math.cos(t * 0.8) * 5 + Math.tan(t * 0.4) * 3,   // Y-axis: Up/down movement with varying speed
        Math.sin(t * 1.5) * 7 + Math.cos(t * 0.6) * 4    // Z-axis: Back and forth with a swaying motion
      );
      dummy.rotation.x = dummy.rotation.y = t;
      dummy.updateMatrix();
      cubeMesh2.current.setMatrixAt(i, dummy.matrix);
    }

    // Cube movement 3
    for (let i = 0; i < cubeCount3; i++) {
      const t = clock.elapsedTime + i * 0.1;
      dummy.position.set(
        Math.sin(t * 0.3) * 35 + Math.cos(t * 0.5) * 5,  // X-axis: A different pattern for variation
        Math.cos(t * 0.5) * 7 + Math.sin(t * 0.3) * 3,   // Y-axis: Moves in a different oscillating pattern
        Math.sin(t * 0.7) * 12 + Math.cos(t * 1.2) * 6   // Z-axis: Varying speed and back/forth motion
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
}
  

// Subtle wavy plane in the mid-background
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
    <mesh ref={mesh} position={[0, 11, -10]} rotation={[Math.PI /2, 0, 0]}>
      <primitive object={geometry} />
      <meshBasicMaterial 
        color="#112154" 
        transparent 
        
      />
    </mesh>
  )
}

// Combined background component
function DynamicBackground() {
  return (
    <group>
      <FloatingShapes />
      <WavyPlane />
    </group>
  )
}

const HomeBackground = () => {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 10], fov: 50 }}>
      <CameraAnimation />
      <EffectComposer>
        <Bloom 
          intensity={0.1} 
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9} 
        />
        <Vignette darkness={0.4} offset={0.3} />
        <DepthOfField focusDistance={0.01} focalLength={0.08} bokehScale={2} />
      </EffectComposer>
        <DynamicBackground />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color attach="background" args={["#101010"]} />
        <fog attach="fog" args={["#101010", 10, 60]} />
        

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
          <DraggableText position={[0, 5, -12]} rotation={[-0.3, -0.2, 0]}>Hello my name</DraggableText>
          <DraggableText position={[0, 3, -12]} rotation={[0.3, 0.2, 0]} spacing={{ character: 0.7, word: 1 }}>is Jose Castro !</DraggableText>
          
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