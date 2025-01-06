import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, SpotLight, Text, Text3D, MeshReflectorMaterial, Center, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three'

import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'


const CameraAnimation = ({ selectedName }) => {
  const { camera } = useThree();
  const prevSelectedRef = useRef(selectedName);
  const initialY = 10;
  const targetY = 2;
  
  // Calculate camera position based on selected mesh
  const getSelectedPosition = (name) => {
    switch(name) {
      case 'About':
        return [-3, 1, 8];
      case 'Projects':
        return [0, 1, 8];
      case 'Contact':
        return [3, 1, 8];
      default:
        return [0, targetY, 10];
    }
  };

  // Calculate look-at point based on selected mesh
  const getLookAtPosition = (name) => {
    switch(name) {
      case 'About':
        return [0, 0.2, 0];
      case 'Projects':
        return [3, 0.4, 0];
      case 'Contact':
        return [6, 0.3, 0];
      default:
        return [0, 2, 0];
    }
  };

  // Store previous position before transition
  useEffect(() => {
    prevSelectedRef.current = selectedName;
  }, [selectedName]);

  // Combined spring for all camera movements
  const { cameraX, cameraY, cameraZ, lookAtX, lookAtY, lookAtZ } = useSpring({
    cameraX: selectedName ? getSelectedPosition(selectedName)[0] : 0,
    cameraY: selectedName ? getSelectedPosition(selectedName)[1] : targetY,
    cameraZ: selectedName ? getSelectedPosition(selectedName)[2] : 10,
    lookAtX: selectedName ? getLookAtPosition(selectedName)[0] : 0,
    lookAtY: selectedName ? getLookAtPosition(selectedName)[1] : 2,
    lookAtZ: selectedName ? getLookAtPosition(selectedName)[2] : 0,
    from: {
      cameraX: prevSelectedRef.current ? getSelectedPosition(prevSelectedRef.current)[0] : camera.position.x,
      cameraY: prevSelectedRef.current ? getSelectedPosition(prevSelectedRef.current)[1] : camera.position.y,
      cameraZ: prevSelectedRef.current ? getSelectedPosition(prevSelectedRef.current)[2] : camera.position.z,
      lookAtX: prevSelectedRef.current ? getLookAtPosition(prevSelectedRef.current)[0] : 0,
      lookAtY: prevSelectedRef.current ? getLookAtPosition(prevSelectedRef.current)[1] : 2,
      lookAtZ: prevSelectedRef.current ? getLookAtPosition(prevSelectedRef.current)[2] : 0,
    },
    config: {
      mass: 3,
      tension: 150,
      friction: 25,
      precision: 0.001,
    },
    immediate: false,
  });

  useFrame(() => {
    // Smooth position transition
    camera.position.set(
      cameraX.get(),
      cameraY.get(),
      cameraZ.get()
    );
    
    // Smooth look-at transition
    camera.lookAt(
      lookAtX.get(),
      lookAtY.get(),
      lookAtZ.get()
    );
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
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 mr-8 ${
        isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
      } pointer-events-none`}
    >
      <div
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 rounded-lg shadow-2xl max-w-md w-96 pointer-events-auto"
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
const HoverableMesh = ({ position, hoverColor, name, onSelect, selectedName }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const rotationRef = useRef(0); // Track the current rotation

  // Load the appropriate model based on the name
  const modelPaths = {
    About: 'models/About.glb',
    Projects: 'models/Projects.glb',
    Contact: 'models/Contact.glb',
  };

  const { scene } = useGLTF(modelPaths[name]);

  // Determine if this mesh is active based on the selectedName prop
  const active = selectedName === name;

  // Self-contained spring animation
  const { scale, positionZ } = useSpring({
    scale: hovered || active ? 1.2 : 1,
    positionZ: active ? 2 : 0,
    config: { tension: 120, friction: 14 }, // Smooth spring config
  });

  // Apply hover color effect to the model's materials
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        if (hovered) {
          // Apply a glowing white emissive color when hovered
          child.material = child.material.clone(); // Avoid modifying the original material
          child.material.emissive = new THREE.Color(0xffffff); // White emissive color
          child.material.emissiveIntensity = 0.1; // Adjust intensity to control brightness
        } else {
          // Reset emissive property when not hovered
          child.material.emissive = new THREE.Color(0x000000); // No glow (black emissive)
        }
      }
    });
  }, [hovered, scene]);

  // Rotation and animation logic
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (active) {
        // When active, rotate continuously
        rotationRef.current += delta * 1.5;
        meshRef.current.rotation.y = rotationRef.current;
      } else {
        // Smoothly return to forward-facing position
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
      <animated.group
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
        {/* Attach the imported model */}
        <primitive object={scene} />
      </animated.group>
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
    <mesh ref={mesh} position={[0, 15, -10]} rotation={[Math.PI /2, 0, 0]}>
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


const TextOn3DPath = ({ 
  children, 
  radius = 8, 
  height = 0, 
  rotationSpeed = 0.3,
  pathTilt = Math.PI / 6
}) => {
  const groupRef = useRef();
  const characters = children.split('');
  
  // Calculate spacing between characters
  const angleStep = (2 * Math.PI) / (characters.length * 1.5);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {characters.map((char, index) => {
        const angle = angleStep * index;
        
        // Calculate 3D position on tilted circular path
        const x = Math.sin(angle) * radius;
        const y = Math.sin(angle) * radius * Math.sin(pathTilt) + height;
        const z = Math.cos(angle) * radius;
        
        // Calculate rotations - now the text faces forward
        const rotationY = angle; // Removed the + Math.PI/2 to face forward
        const rotationX = Math.sin(angle) * pathTilt;
        
        return (
          <Center key={`${char}-${index}`} position={[x, y, z]}>
            <Text3D
              rotation={[rotationX, rotationY, 0]}
              curveSegments={32}
              bevelEnabled
              bevelSize={0.04}
              bevelThickness={0.1}
              height={0.3}
              size={0.8}
              font="/Inter_Bold.json"
            >
              {char}
              <ColorChangingMaterial />
            </Text3D>
          </Center>
        );
      })}
    </group>
  );
};

const DraggableShape = ({ position, shape = 'box' }) => {
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
    
    rigidBodyRef.current.setTranslation(
      { x: newX, y: newY, z: position[2] },
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
      position={position}
      restitution={0.7}
      friction={0.2}
    >
      {shape === 'box' ? (
        <>
          <mesh
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isDragging ? '#ff6b6b' : '#4ec9b0'} />
          </mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
        </>
      ) : (
        <>
          <mesh
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <torusGeometry />
            <meshStandardMaterial color={isDragging ? '#ffd93d' : '#6c5ce7'} />
          </mesh>
          <BallCollider args={[0.5]} />
        </>
      )}
    </RigidBody>
  );
};

const FloatingText = ({ children, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  
  // Calculate text bounds (approximation based on text settings)
  const textSize = 1.5;
  const textHeight = 1;
  const letterSpacing = -0.06;
  const approximateWidth = children.length * (textSize + letterSpacing);
  const halfWidth = approximateWidth / 2.5;
  const halfHeight = textHeight;
  
  // Spring animation for the main text
  const [spring, api] = useSpring(() => ({
    position: position,
    rotation: rotation,
    config: { mass: 2, tension: 200, friction: 15 }
  }));

  // Individual springs for each corner mesh - positioned relative to text position
  const [topRightSpring, topRightApi] = useSpring(() => ({
    position: [position[0] + halfWidth, position[1] + halfHeight, position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 150, friction: 10 }
  }));
  
  const [topLeftSpring, topLeftApi] = useSpring(() => ({
    position: [position[0] - halfWidth, position[1] + halfHeight, position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 150, friction: 10 }
  }));
  
  const [bottomRightSpring, bottomRightApi] = useSpring(() => ({
    position: [position[0] + halfWidth, position[1] - halfHeight, position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 150, friction: 10 }
  }));
  
  const [bottomLeftSpring, bottomLeftApi] = useSpring(() => ({
    position: [position[0] - halfWidth, position[1] - halfHeight, position[2]],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 150, friction: 10 }
  }));

  // Custom corner meshes with different geometries
  const TopRightMesh = ({ springProps }) => (
    <animated.mesh position={springProps.position} rotation={springProps.rotation} scale={0.7}>
      <boxGeometry /> {/* Cube */}
      <meshNormalMaterial />
    </animated.mesh>
  );

  const TopLeftMesh = ({ springProps }) => (
    <animated.mesh position={springProps.position} rotation={springProps.rotation} scale={0.5}>
      <tetrahedronGeometry /> {/* Pyramid */}
      <meshNormalMaterial />
    </animated.mesh>
  );

  const BottomRightMesh = ({ springProps }) => (
    <animated.mesh position={springProps.position} rotation={springProps.rotation} scale={0.5}>
      <octahedronGeometry /> {/* Diamond */}
      <meshNormalMaterial />
    </animated.mesh>
  );

  const BottomLeftMesh = ({ springProps }) => (
    <animated.mesh position={springProps.position} rotation={springProps.rotation} scale={0.5}>
      <dodecahedronGeometry /> {/* Sphere */}
      <meshNormalMaterial />
    </animated.mesh>
  );

  useFrame(({ mouse, viewport, clock }) => {
    mousePos.current = {
      x: (mouse.x * viewport.width) / 2,
      y: (mouse.y * viewport.height) / 2
    };

    const distance = new THREE.Vector2(
      mousePos.current.x - position[0],
      mousePos.current.y - (position[1] - 1.5)
    ).length();

    const time = clock.getElapsedTime();
    const rotationSpeed = 0.5;

    if (distance < 3) {
      setIsHovered(true);
      const factor = 1 - (distance / 4);
      const offsetX = (mousePos.current.x - position[0]) * factor * 0.8;
      const offsetY = (mousePos.current.y - position[1]) * factor * 0.8;
      
      // Move text
      api.start({
        position: [
          position[0] - offsetX,
          position[1] - offsetY,
          position[2]
        ],
        rotation: rotation
      });

      // Continuously update rotation for hovering meshes
      rotationRef.current.x += rotationSpeed * 0.02;
      rotationRef.current.y += rotationSpeed * 0.015;
      rotationRef.current.z += rotationSpeed * 0.01;

      [
        [topRightApi, 1, 1],
        [topLeftApi, -1, 1],
        [bottomRightApi, 1, -1],
        [bottomLeftApi, -1, -1]
      ].forEach(([api, xDir, yDir]) => {
        api.start({
          position: [
            position[0] + (4 * xDir) - offsetX * 1.5,
            (position[1] - 2) + (1 * yDir) - offsetY * 1.5,
            -2
          ],
          rotation: [
            rotationRef.current.x,
            rotationRef.current.y,
            rotationRef.current.z
          ]
        });
      });
    } else {
      setIsHovered(false);
      // Return text to original position while maintaining rotation
      api.start({
        position: position,
        rotation: rotation
      });
      
      // Keep current rotation but return to original positions
      topRightApi.start({ 
        position: [position[0] + 6, position[1] + 3, position[2]],
        rotation: [rotationRef.current.x, rotationRef.current.y, rotationRef.current.z]
      });
      topLeftApi.start({ 
        position: [position[0] - 7, position[1] + halfHeight, position[2]],
        rotation: [rotationRef.current.x, rotationRef.current.y, rotationRef.current.z]
      });
      bottomRightApi.start({ 
        position: [position[0] + halfWidth, position[1], position[2]],
        rotation: [rotationRef.current.x, rotationRef.current.y, rotationRef.current.z]
      });
      bottomLeftApi.start({ 
        position: [position[0] - 7, position[1] - halfHeight, -8],
        rotation: [rotationRef.current.x, rotationRef.current.y, rotationRef.current.z]
      });
    }
  });

  return (
    <group>
      <animated.group ref={groupRef} {...spring}>
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
          >
            {children}
            <meshNormalMaterial />
          </Text3D>
        </Center>
      </animated.group>
      
        {/* Individual corner meshes with different shapes */}
        <TopRightMesh springProps={topRightSpring} />
        <TopLeftMesh springProps={topLeftSpring} />
        <BottomRightMesh springProps={bottomRightSpring} />
        <BottomLeftMesh springProps={bottomLeftSpring} />
      </group>
  );
};

const HomeBackground = () => {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 10], fov: 50 }}>
      <CameraAnimation selectedName={selectedName} />
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
      
      {/* <TextOn3DPath 
        radius={2} 
        height={4} 
        rotationSpeed={0.7} 
        pathTilt={0}
      >
        Welcome!
      </TextOn3DPath> */}
        
        {selectedName && (
          <SpotLight
            position={[selectedName === 'About' ? -3 : selectedName === 'Projects' ? 0 : 3, 4, 1]}
            angle={0.5}
            intensity={100}
            penumbra={1}
            distance={8}
            color="white"
            castShadow
            target-position={[selectedName === 'About' ? -3 : selectedName === 'Projects' ? 0 : 3, 0, 2]}
          />
        )}

        <Physics gravity={[0, -9.8, 0]}>
          <FloatingText position={[-2, 6, -10]} rotation={[-0.3, -0.2, 0]}>Hello my name </FloatingText>
          <FloatingText position={[2, 4, -10]} rotation={[0.3, 0.2, 0]}>is Jose Castro !</FloatingText>
          
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
                mixBlur={0.8}
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

        <Physics gravity={[0, -9.8, 0]}>
          <DraggableShape position={[-10, 5, -5]} shape="box" />
          <DraggableShape position={[-9.5, 7, -5]} shape="box" />
          <DraggableShape position={[10, 5, -5]} shape="fart" />
            <RigidBody type="fixed">
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.8, 0]}
              >
                <planeGeometry args={[170, 170]} />
                <meshStandardMaterial 
                  transparent
                  opacity={0}
                />
              </mesh>
            </RigidBody>
        </Physics>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[-3, 0.2, 0]} 
                color="blue" 
                hoverColor="lightblue" 
                name="About"
                onSelect={setSelectedName}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[0, 0.4, 0]} 
                color="green" 
                hoverColor="lightgreen" 
                name="Projects"
                onSelect={setSelectedName}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[3, 0.3, 0]} 
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