import React, { Suspense, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineArrowLeft, AiOutlineShopping } from 'react-icons/ai';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
import { easing } from 'maath';
import '../../styles/PreviewCustomization.css';
import shirtGLB from '../../assets/shirt_baked.glb';

// Estado global simple
const colors = ['#EFBD48', '#726DE8', '#EF674E', '#80C670', '#353934', '#ccc'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Modelo camiseta
const TshirtModel = ({ color }) => {
  const { nodes, materials } = useGLTF(shirtGLB);

  useFrame((state, delta) => {
    if (materials.lambert1) {
      easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male?.geometry}
      material={materials.lambert1}
      dispose={null}
      scale={5.3} 
    />
  );
};

const PreviewCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state || {};
  const [shirtColor, setShirtColor] = React.useState(getRandomColor());

  const handleGoBack = () => navigate(-1);
  const handleStartCustomization = () => {
    navigate('/TshirtDesign', { state: { ...productData, fromPreview: true } });
  };

  return (
    <div className="preview-container">
      <div className="preview-overlay">
        {/* Header */}
        <motion.header className="preview-header">
          <div className="logo-container">
            <AiOutlineShopping size="2.5em" color="#fff" />
          </div>
          <button className="back-button" onClick={handleGoBack}>
            <AiOutlineArrowLeft size="1.5em" /> Volver
          </button>
        </motion.header>

        {/* Contenido */}
        <div className="preview-content">
          {/* Texto izquierdo */}
          <div className="intro-section">
            <h1 className="main-title">LET'S DO IT.</h1>
            {productData.name && <h2 className="product-name">{productData.name}</h2>}
            {productData.price && <p className="product-price">${productData.price.toFixed(2)}</p>}
            <p className="description">
              Create your unique and exclusive shirt with our brand-new 3D customization tool.{' '}
              <strong>Unleash your imagination</strong> and define your own style.
            </p>
            <button className="customize-button" onClick={handleStartCustomization}>
              CUSTOMIZE IT
            </button>
          </div>

          {/* Canvas derecha */}
          <div className="tshirt-canvas-container">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ width: '100%', height: '100%' }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5 * Math.PI} />
                <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
                <Center>
                  <TshirtModel color={shirtColor} />
                </Center>
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.8}
                  minAzimuthAngle={-Math.PI / 3}
                  maxAzimuthAngle={Math.PI / 3}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

useGLTF.preload(shirtGLB);
export default PreviewCustomization;
