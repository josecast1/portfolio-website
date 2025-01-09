import { useThree, useFrame } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { useRef, useEffect } from 'react';

// Camera animation for when user opens the site and to zoom in on a model when selected
const CameraAnimation = ({ selectedName }) => {
    const { camera } = useThree();
    const prevSelectedRef = useRef(selectedName);
    const initialY = 10;
    const targetY = 2;
    
    // Move camera position based on selected mesh
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
  
    // Move look-at point based on selected mesh
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

export default CameraAnimation;