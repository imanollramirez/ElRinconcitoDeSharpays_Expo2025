// src/components/ImagePreview.jsx
import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import '../styles/ImagePreview.css';

const ImagePreview = ({ imageUrl }) => {
    const [hovered, setHovered] = useState(false);
  
    return (
      <div
        className="image-preview-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Vista previa" className="preview-image" />
        ) : (
          <div className="icon-wrapper">
            <FaImage size={60} color="#999" /> {/* Icono de imagen por defecto */}
          </div>
        )}
  
        <div className={`hover-glass ${hovered ? 'show' : ''}`}>
          <div className="glass-text">Vista previa</div>
        </div>
      </div>
    );
  };
  
  export default ImagePreview;
