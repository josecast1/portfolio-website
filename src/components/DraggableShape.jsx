import React, { useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier';

// Mesh geometries on the sides with rapier physics that can be picked up with mouse
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

export default DraggableShape;