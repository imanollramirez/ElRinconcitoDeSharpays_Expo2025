import React, { forwardRef, useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import './Carnet3D.css';

const Card3D = forwardRef(({ data }, ref) => {
  const tiltRef = useRef();

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 6,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        scale: 1.05,
      });
    }
  }, []);

  const {
    apellido,
    nombre,
    genero,
    nacimiento,
    emergencia,
    nacionalidad,
    foto,
    numero
  } = data;

  return (
  <div ref={ref}>
    <div className="id-card tilt-effect" ref={tiltRef}>
      <div className="holographic-overlay" />
      <div className="header1">
        <div className="title1">
          <p>República de El Salvador</p>
          <p className="subtitle1">Documento Único de Animal</p>
        </div>
      </div>

      <div className="photo-section">
        <img
          src={foto}
          alt="Foto del animal"
          className="profile-pic"
        />
      </div>

      <div className="info-section">
        <p><strong>Apellidos:</strong> {apellido}</p>
        <p><strong>Nombres:</strong> {nombre}</p>
        <p><strong>Género:</strong> {genero} &nbsp;&nbsp; <strong>Nacionalidad:</strong> {nacionalidad}</p>
        <p><strong>Fecha y lugar de nacimiento:</strong> {nacimiento}</p>
        <p><strong>En caso de emergencia llamar a:</strong> {emergencia}</p>
      </div>

      <div className="footeer">
        <p className="id-number">ID: {numero}</p>
      </div>

      {/* Aquí agregamos la huella */}
      <div className="dog-paw-hologram" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="80" height="80" fill="none" stroke="rgba(0,102,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="48" r="10" />
          <ellipse cx="20" cy="20" rx="7" ry="10" />
          <ellipse cx="32" cy="12" rx="7" ry="10" />
          <ellipse cx="44" cy="20" rx="7" ry="10" />
          <ellipse cx="26" cy="28" rx="6" ry="8" />
          <ellipse cx="38" cy="28" rx="6" ry="8" />
        </svg>
      </div>
    </div>
  </div>
);

});

export default Card3D;
