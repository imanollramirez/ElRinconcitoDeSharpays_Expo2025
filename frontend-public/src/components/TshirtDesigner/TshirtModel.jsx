import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';

const TshirtModel = ({ state }) => {
  const meshRef = useRef();
  const snap = useSnapshot(state);

  // Rotación suave
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  // Crear geometría de camiseta básica
  const createTshirtGeometry = () => {
    const shape = new THREE.Shape();
    
    // Contorno básico de camiseta
    shape.moveTo(0, 0);
    shape.lineTo(0, 1.5);
    shape.lineTo(-0.3, 1.8);
    shape.lineTo(-0.8, 1.8);
    shape.lineTo(-1, 1.6);
    shape.lineTo(-1, 0.8);
    shape.lineTo(-0.6, 0.8);
    shape.lineTo(-0.6, 0);
    shape.lineTo(0.6, 0);
    shape.lineTo(0.6, 0.8);
    shape.lineTo(1, 0.8);
    shape.lineTo(1, 1.6);
    shape.lineTo(0.8, 1.8);
    shape.lineTo(0.3, 1.8);
    shape.lineTo(0, 1.5);

    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={createTshirtGeometry()} />
      <meshStandardMaterial 
        color={snap.color}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
};

export default TshirtModel;