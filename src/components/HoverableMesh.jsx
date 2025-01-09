import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Model component that user can click
const HoverableMesh = ({ position, hoverColor, name, onSelect, selectedName }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const rotationRef = useRef(0); // Track the current rotation
  
    // Load the models
    const modelPaths = {
      About: 'models/About.glb',
      Projects: 'models/Projects.glb',
      Contact: 'models/Contact.glb',
    };
  
    const { scene } = useGLTF(modelPaths[name]);
  
    // Determine if this mesh is active based on the selectedName prop
    const active = selectedName === name;
  
    // Spring animation
    const { scale, positionZ } = useSpring({
      scale: hovered || active ? 1.2 : 1,
      positionZ: active ? 2 : 0,
      config: { tension: 120, friction: 14 },
    });
  
    // Hover color effect
    useEffect(() => {
      if (!scene) return;
      scene.traverse((child) => {
        if (child.isMesh) {
          if (hovered) {
            // Apply a glowing white emissive color when hovered
            child.material = child.material.clone(); // To not modify the original material
            child.material.emissive = new THREE.Color(0xffffff); // White emissive color
            child.material.emissiveIntensity = 0.1; // Control brightness
          } else {
            // Reset emissive property when not hovered
            child.material.emissive = new THREE.Color(0x000000); // No glow
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
          // Smoothly return to forward-facing position regardless of how many times it was rotated
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
          {/* Add the model */}
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

export default HoverableMesh;