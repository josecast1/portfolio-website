import React, {useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, SpotLight, MeshReflectorMaterial } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import CameraAnimation from './components/CameraAnimation';
import InfoPanel from './components/InfoPanel';
import HoverableMesh from './components/HoverableMesh';
import FloatingShapes from './components/FloatingShapes';
import WavyPlane from './components/WavyPlane';
import DraggableShape from './components/DraggableShape';
import FloatingText from './components/FloatingText';


// Combined background component
function DynamicBackground() {
  return (
    <group>
      <FloatingShapes />
      <WavyPlane />
    </group>
  )
}

const HomePage = () => {
  const [selectedName, setSelectedName] = useState(null);

  const handleMeshSelect = (name) => {
    setSelectedName(name === selectedName ? null : name);
  };

  const handleTabSelect = (tab) => {
    setSelectedName(tab); // Update selected mesh when tab changes
  };

  // To change the scale value for the info panel. var(--viewport-scale) is then used for the tailwind scale animations
  useEffect(() => {
    function updateScaleVariable() {
      const scale = window.innerWidth / 1920;
      document.documentElement.style.setProperty('--viewport-scale', scale);
    }

    updateScaleVariable();
    window.addEventListener('resize', updateScaleVariable);
    return () => window.removeEventListener('resize', updateScaleVariable);
  }, []);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 10], fov: 50 }}>
        <CameraAnimation selectedName={selectedName} />
        {/* Postprocessing to improve lighting and use depth of field */}
        <EffectComposer>
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
          />
          <Vignette darkness={0.4} offset={0.3} />
          <DepthOfField focusDistance={0.01} focalLength={0.08} bokehScale={2} />
        </EffectComposer>
        {/* Lighting for scene and colors for background */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <color attach="background" args={["#101010"]} />
        <fog attach="fog" args={["#101010", 10, 60]} />

        {/* Wavy plane and moving box meshes in the background */}
        <DynamicBackground />

        {/* Hello text on top of meshes */}
        <FloatingText position={[-2, 6, -10]} rotation={[-0.3, -0.2, 0]}>Hello my name </FloatingText>
        <FloatingText position={[2, 4, -10]} rotation={[0.3, 0.2, 0]}>is Jose Castro !</FloatingText>

        {/* Spotlights that appear over selected models */}
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
          {/* Meshes users can pick up that are positioned on the sides */}
          <DraggableShape position={[-11, 2, -5]} rotation={[1, 2, 2]} shape="box" />
          <DraggableShape position={[-10.5, 4, -5]} rotation={[1, 4, 3]} shape="box" />

          <DraggableShape position={[11, 4, -5]} rotation={[1, 4, 3]} shape="torus" />
          <DraggableShape position={[11, 6, -5]} rotation={[1, 2, 3]} shape="torus" />

          {/* Plane with reflector material for the scene that is a fixed rigid body for the meshes to fall on */}
          <RigidBody type="fixed">
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.8, 0]}
            >
              <planeGeometry args={[170, 170]} />
              <MeshReflectorMaterial
                resolution={1000}
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
        
        {/* About */}
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
        
        {/* Projects */}
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

        {/* Contact */}
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

      {/* Open info panel when user clicks on a model */}
      {selectedName && (
        <InfoPanel 
          name={selectedName} 
          onClose={() => setSelectedName(null)}
          onTabSelect={handleTabSelect}
          activeTab={selectedName} // Pass selected name as the active tab
        />
      )}
    </div>
  );
};

export default HomePage;