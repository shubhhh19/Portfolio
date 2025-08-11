import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// Particle system component
function ParticleField({ count = 2000 }) {
  const ref = useRef();
  
  const [sphere] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create particles in a sphere formation
      const [x, y, z] = random.inSphere(new Float32Array(3), { radius: 8 });
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Terminal green with some variation
      const greenIntensity = Math.random() * 0.8 + 0.2;
      colors[i3] = 0; // R
      colors[i3 + 1] = greenIntensity; // G
      colors[i3 + 2] = greenIntensity * 0.5; // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} colors={null} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime / 4) * 0.1;
      group.current.rotation.y = Math.sin(state.clock.elapsedTime / 3) * 0.1;
    }
  });
  
  return (
    <group ref={group}>
      {/* Wireframe cube */}
      <mesh position={[-3, 2, -2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#00ff88" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Wireframe sphere */}
      <mesh position={[3, -1, -3]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#0066ff" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Wireframe torus */}
      <mesh position={[1, 3, -4]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.6, 0.2, 8, 16]} />
        <meshBasicMaterial 
          color="#6600ff" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
}

// Main background component
const Background3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Particle field */}
        <ParticleField count={1500} />
        
        {/* Floating shapes */}
        <FloatingShapes />
      </Canvas>
    </div>
  );
};

export default Background3D;