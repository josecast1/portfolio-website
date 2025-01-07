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
const InfoPanel = ({ name, onClose, onTabSelect, activeTab }) => {
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Update content height when tab changes
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      // Limit the height to 400px maximum while allowing smaller heights
      setContentHeight(Math.min(height, 400));
    }
  }, [activeTab]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTabClick = (tab) => {
    onTabSelect(tab);
  };


  const content = {
    About: (
      <div className="flex flex-col items-center space-y-6">
        {/* Image and Content */}
        <div className="flex items-center space-x-6">
          {/* Image */}
          <div className="relative">
            <img 
              src="/PortfolioHeadshot.jpg"
              alt="Jose Castro"
              className="w-[56rem] h-72 rounded-full object-fill shadow-lg"
            />
            <div className="absolute inset-0 border-4 border-blue-400 rounded-full hover:animate-pulse"></div>
          </div>
    
          {/* Content */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-blue-400">Hello, I'm Jose Castro!</h2>
            <p className="text-base leading-relaxed text-gray-300">
              I'm a Computer Science student at the University of Florida, passionate about crafting meaningful tech 
              solutions. My experience spans web development, game design, and community leadership.
            </p>
          </div>
        </div>
      </div>
    ),
    Projects: (
      <div className="space-y-8 text-lg">
        {/* Steam Wrapped Website */}
        <div className="project-item">
          <div className="flex justify-between items-start mb-2">
            <a 
              href="https://steam-wrapped-frontend.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Steam Wrapped Website
            </a>
            <span className="text-gray-400 text-base mr-4">Fall 2024</span>
          </div>
          <div className="text-gray-300 text-base mb-3">Javascript, Python</div>
          <ul className="list-disc pl-5 space-y-2 mr-4 text-base">
            <li>Collaboratively developed a full-stack web application hosted on Vercel, allowing users to create tasks, set goals, track progress, and visualize & analyze habits for game achievements from their Steam profile.</li>
            <li>Developed a RESTful Flask API integrating Google OAuth for one-time user login using Steam profile links.</li>
            <li>Utilized Next.js/React for the frontend, styled with Tailwind CSS, and Flask for core API functionality, with Express.js handling responses between the frontend and backend.</li>
            <li>Built endpoints to retrieve user information, game data, and achievements from the Steam API, with MongoDB used to store and manage user data.</li>
            <li>Implemented unit testing with pytest for Flask endpoints to ensure reliable functionality.</li>
          </ul>
          <div className="border-b border-gray-700 mt-8"></div>
        </div>

        {/* County Demographic Viewer */}
        <div className="project-item">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-blue-400">County Demographic Viewer</h3>
            <span className="text-gray-400 text-base mr-4">Summer 2024</span>
          </div>
          <div className="text-gray-300 text-base mb-3">Javascript</div>
          <ul className="list-disc pl-5 space-y-2 text-base mr-4">
            <li>Collaboratively developed a web application that allows users to select a state and county in the United States, filter demographic categories, and display the data in either a list or bar chart format.</li>
            <li>Employed algorithms for fetching and processing JSON data, populating dropdowns dynamically, and handling form events and user interactions efficiently.</li>
            <li>Utilized HTML, CSS, JS-sdsl, Chart.js, Tailwind CSS, and Flowbite.</li>
          </ul>
          <div className="border-b border-gray-700 mt-8"></div>
        </div>

        {/* SHPE Discord Bot */}
        <div className="project-item">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-blue-400">SHPE Discord Bot</h3>
            <span className="text-gray-400 text-base mr-4">Fall 2023 – Spring 2024</span>
          </div>
          <div className="text-gray-300 text-base mb-3">Python</div>
          <ul className="list-disc pl-5 space-y-2 text-base mr-4">
            <li>Collaborated with a team to develop an essential communication tool within our Discord SHPE community, which serves as a hub for real-time announcements, event reminders, and member engagement.</li>
            <li>Asana is utilized to streamline project management, the Discord API is implemented for seamless integration, APScheduler is used to send out automated announcements, the bot's functionality is thoroughly documented, and pytests are employed for rigorous unit testing to ensure robust performance and reliability.</li>
          </ul>
          <div className="border-b border-gray-700 mt-8"></div>
        </div>

        {/* Perfect Pigment */}
        <div className="project-item">
          <div className="flex justify-between items-start mb-2">
            <a 
              href="https://play.unity.com/en/games/59451da3-2747-4ded-8781-8c3feae2d0bd/perfect-pigment" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Perfect Pigment
            </a>
            <span className="text-gray-400 text-base mr-4">Summer 2023</span>
          </div>
          <div className="text-gray-300 text-base mb-3">C#</div>
          <ul className="list-disc pl-5 space-y-2 text-base mr-4">
            <li>Developed a 3D platformer first-person shooter with two other colleagues in which you must traverse multiple levels while being timed, using the Unity Engine and C#.</li>
            <li>Modeled custom assets, created custom textures, designed UI, programmed movement, scoreboards, weapon animations, enemies, and creating particle effects.</li>
          </ul>
        </div>
      </div>
    ),
    Contact: (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto"> 
        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-400 mb-2">Get in Touch</h2>
        
        {/* Contact Details */}
        <div className="grid text-lg text-gray-300 w-full gap-2">
          <p className="flex items-center justify-center gap-2">
            <span className="font-semibold text-gray-100">Email:</span>
            <span>josecastro3249@gmail.com</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="font-semibold text-gray-100">LinkedIn:</span>
            <a
              href="https://www.linkedin.com/in/josecastro01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-500 transition-colors"
            >
              linkedin.com/in/josecastro01
            </a>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="font-semibold text-gray-100">GitHub:</span>
            <a
              href="https://github.com/josecast1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-500 transition-colors"
            >
              github.com/josecast1
            </a>
          </p>
          <p className="flex items-center justify-center gap-2 mb-2">
            <span className="font-semibold text-gray-100">Phone:</span>
            <span>(305)-728-9492</span>
          </p>
        </div>
      
        {/* Divider */}
        <div className="w-24 h-1 bg-blue-400 rounded-full mb-4"></div>
      
        {/* Enhanced CTA Button */}
        <a
          href="mailto:josecastro3249@gmail.com"
          className="bg-blue-500 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Contact Me
        </a>
      </div>
    ),
  };

  return (
    <div
      className={`fixed top-1/2 z-50 pointer-events-none ${
        isClosing ? "animate-scale-out" : "animate-scale-in"
      }`}
      style={{ 
        right: "10vw",
        width: "40rem",
        transform: "translateY(-50%)"  // Separate the vertical centering
      }}
    >
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 sm:p-8 rounded-xl shadow-2xl pointer-events-auto relative">
        {/* X close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-700 pb-4 mb-6 overflow-x-auto">
          {Object.keys(content).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content with dynamic height */}
        <div 
          className="overflow-y-auto custom-scrollbar transition-[height] duration-300 ease-in-out"
          style={{ height: `${contentHeight}px`, maxHeight: "calc(90vh - 12rem)" }}
        >
          <div ref={contentRef}>
            {content[activeTab]}
          </div>
        </div>
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

const DraggableShape = ({ position, rotation, shape = 'box' }) => {
  const rigidBodyRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const bodyStart = useRef({ x: 0, y: 0 });

    const { scale } = useSpring({
    scale: isDragging ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

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
      rotation={rotation}
      restitution={0.7}
      friction={0.2}
    >
      {shape === 'box' ? (
        <>
          <animated.mesh
            scale={scale}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isDragging ? '#ff6b6b' : '#4ec9b0'} />
          </animated.mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
        </>
      ) : (
        <>
          <animated.mesh
            scale={scale}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <torusGeometry />
            <meshStandardMaterial color={isDragging ? '#ffd93d' : '#6c5ce7'} />
          </animated.mesh>
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

  const handleMeshSelect = (name) => {
    setSelectedName(name === selectedName ? null : name);
  };

  const handleTabSelect = (tab) => {
    setSelectedName(tab); // Update selected mesh when tab changes
  };

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
          <DraggableShape position={[-11, 2, -5]} rotation={[1, 2, 2]} shape="box" />
          <DraggableShape position={[-10.5, 4, -5]} rotation={[1, 4, 3]} shape="box" />
          <DraggableShape position={[11, 4, -5]} rotation={[1, 4, 3]} shape="torus" />
          <DraggableShape position={[11, 6, -5]} rotation={[1, 2, 3]} shape="torus" />
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
                onSelect={handleMeshSelect}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[0, 0.4, 0]} 
                color="green" 
                hoverColor="lightgreen" 
                name="Projects"
                onSelect={handleMeshSelect}
                selectedName={selectedName}
            />
        </Float>

        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <HoverableMesh 
                position={[3, 0.3, 0]} 
                color="red" 
                hoverColor="pink" 
                name="Contact"
                onSelect={handleMeshSelect}
                selectedName={selectedName}
            />
        </Float>
      </Canvas>

      {selectedName && (
        <InfoPanel 
          name={selectedName} 
          onClose={() => setSelectedName(null)}
          onTabSelect={handleTabSelect}
          activeTab={selectedName} // Pass the selected name as the active tab
        />
      )}
    </div>
  );
};

export default HomeBackground;