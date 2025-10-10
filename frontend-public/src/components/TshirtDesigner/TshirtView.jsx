// TShirtView.jsx - CORREGIDO CON SOPORTE PARA TAZAS
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TShirtView = ({ tshirtColor, canvasRef }) => {
  const location = useLocation();
  const colorLayerRef = useRef(null);
  const containerRef = useRef(null);
  
  // IDs de subcategorías
  const CAMISA_SUBCATEGORY_ID = "6855bf4a8bda3da90eca92c6";
  const TAZA_SUBCATEGORY_ID = "68af2494a7e54f57647273ab"; 
  
  // Obtener datos del producto desde el state de navegación
  const productData = location.state;
  
  // Determinar el tipo de producto basado en el subCategoryId del producto original
  // Nota: Necesitarás pasar también el subCategoryId en el navigate desde CamisaDetail
  const isTaza = productData?.subCategoryId === TAZA_SUBCATEGORY_ID;
  
  // Seleccionar la imagen apropiada
  const productImage = isTaza ? '/images/Taza.png' : '/images/dualchemis.png';
  
  // Apply color
  useEffect(() => {
    if (colorLayerRef.current) {
      colorLayerRef.current.style.backgroundColor = tshirtColor;
    }
  }, [tshirtColor]);
  
  return (
    <div ref={containerRef} className="tshirt-view-container">
      <div className="tshirt-wrapper">
        {/* Capa de color con máscara - ATRÁS */}
        <div
          ref={colorLayerRef}
          className="tshirt-color-layer"
          style={{
            backgroundColor: tshirtColor,
            maskImage: `url(${productImage})`,
            WebkitMaskImage: `url(${productImage})`,
            zIndex: 1
          }}
        />
        
        {/* Canvas para diseños - EN MEDIO */}
        <canvas
          ref={canvasRef}
          className="design-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            pointerEvents: 'auto'
          }}
        />
        
        {/* Imagen con texturas - ADELANTE PERO TRANSPARENTE */}
        <img
          src={productImage}
          alt={isTaza ? "Mug Template" : "T-Shirt Template"}
          className="tshirt-base-image"
          loading="lazy"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 10,
            mixBlendMode: 'multiply',
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default TShirtView;