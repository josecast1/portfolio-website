import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Hello text with mouse hover animation
const FloatingText = ({ children, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
    const mousePos = useRef({ x: 0, y: 0 });
    const groupRef = useRef();
    const [isHovered, setIsHovered] = useState(false);
    const rotationRef = useRef({ x: 0, y: 0, z: 0 });
    
    // Calculate text bounds, based on text settings
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
  
    // Individual spring animations for each corner mesh
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
        
        // Move text when hovering
        api.start({
          position: [
            position[0] - offsetX,
            position[1] - offsetY,
            position[2]
          ],
          rotation: rotation
        });
  
        // Continuously update rotation for hovering meshes when hovering
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
              position[0] + (4 * xDir) - offsetX * 1.5, // X axis to move radius position and scale of hover effect
              (position[1] - 2) + (1 * yDir) - offsetY * 1.5, // Y axis to move radius position and scale of hover effect
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

export default FloatingText;