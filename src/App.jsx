import React from 'react'
import Home from './components/Home'
import { Canvas } from '@react-three/fiber'
import HomeBackground from './HomeBackground'
import * as THREE from 'three';
import { Html, PerspectiveCamera, OrbitControls, Float } from '@react-three/drei';
import { MotionCanvas, motion } from "framer-motion-3d"
import TestPage from './TestPage';
import TestPage2 from './TestPage2';
import TestPage3 from './TestPage3';

const App = () => {
  return (
      // <div className="relative w-screen h-screen top-0">
      //   <Canvas>
      //     <color attach="background" args={["#101010"]} />
      //     <fog attach="fog" args={["#101010", 10, 20]} />
      //     <ambientLight intensity={0.5} />
      //     <directionalLight position={[5, 5, 5]} intensity={1} />
      //     <PerspectiveCamera makeDefault position={[0, 1, 7]} />

          //  <HomeBackground />
           <TestPage3 />
           
      //     {/* <TestPage /> */}
      //     <Html center>
      //       <Home />
      //     </Html>
      //   </Canvas>
      // </div>
  )
}

export default App
