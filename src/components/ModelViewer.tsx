import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// Model component that loads and displays a 3D model
function Model({ modelPath, scale = 1, position = [0, 0, 0] }: { modelPath: string; scale?: number; position?: number[] }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      // Very subtle rotation animation
      modelRef.current.rotation.y += 0.002;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={scale} 
      position={position as [number, number, number]} 
    />
  );
}

// Loading fallback component
function Loader() {
  return (
    <Html center>
      <div className="loading">
        <span>Loading 3D model...</span>
      </div>
    </Html>
  );
}

// Camera control component
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef(null);

  return (
    <OrbitControls
      ref={controlsRef}
      camera={camera}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={10}
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

// Available models - using stable model URLs from trusted sources
const models = [
  { id: 'astronaut', path: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', name: 'Astronaut', scale: 1.5, position: [0, -1, 0] },
  { id: 'sphere', path: 'https://modelviewer.dev/shared-assets/models/reflective-sphere.gltf', name: 'Reflective Sphere', scale: 1.5, position: [0, 0, 0] },
];

// Preload all models
models.forEach(model => {
  useGLTF.preload(model.path);
});

// Main ModelViewer component
const ModelViewer: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="canvas-container">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#f5f5f5']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <Suspense fallback={<Loader />}>
          <Model 
            modelPath={selectedModel.path} 
            scale={selectedModel.scale} 
            position={selectedModel.position as number[]} 
          />
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={1.5} 
            far={1.5} 
          />
        </Suspense>

        <CameraController />
      </Canvas>

      <div className="model-selector">
        <select 
          value={selectedModel.id}
          onChange={(e) => {
            const model = models.find(m => m.id === e.target.value);
            if (model) setSelectedModel(model);
          }}
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div className="controls">
        <button onClick={() => setRotationEnabled(!rotationEnabled)}>
          {rotationEnabled ? 'Stop' : 'Rotate'}
        </button>
        <button onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      {showInfo && (
        <div className="info-panel">
          <h3>{selectedModel.name}</h3>
          <p>This is an interactive 3D model viewer. Use touch or mouse to rotate, pinch or scroll to zoom.</p>
          <p>Model source: {selectedModel.path.split('/')[2]}</p>
        </div>
      )}
    </div>
  );
};

export default ModelViewer; 