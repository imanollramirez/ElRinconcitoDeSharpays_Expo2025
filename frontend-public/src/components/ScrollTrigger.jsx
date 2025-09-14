import React, { useEffect, useRef, useState } from "react";
import logo1 from "../assets/sharpaysLogo.png";
import logo2 from "../assets/bougies.png";
import logo3 from "../assets/frostyBitesWhite.png";
import logo4 from "../assets/elParaisoDeDios.png";
import logo5 from "../assets/noLosAtropelles.png";
import im1 from "../assets/1.jpeg";
import im2 from "../assets/2.jpeg";
import im3 from "../assets/3.jpeg";
import im4 from "../assets/4.jpeg";
import im5 from "../assets/5.jpeg";

const ScrollTrigger = ({ 
  height = "100vh"
}) => {
  
  const cardsData = [
    {
      title: "Sharpays Boutique",
      description:
        "Este es el primer card con un diseño más minimalista y limpio. Imágenes, luces y contenido elegante.",
      image: im1,
      logo: logo1,
      variant: "card-variant-1",
      colors: ["#ff6b9d", "#ffc3e1", "#ffffff"],
    },
    {
      title: "Bougies",
      description:
        "Velas artesanales y ambientadores naturales que enamoran los sentidos.",
      image: im2,
      logo: logo2,
      variant: "card-variant-2",
      colors: ["#f39c12", "#fff3e0", "#ffffff"],
    },
    {
      title: "FrostyBites",
      description: "Paletas artesanales y postres fríos hechos con amor.",
      image: im3,
      logo: logo3,
      variant: "card-variant-3",
      colors: ["#3498db", "#e3f2fd", "#ffffff"],
    },
    {
      title: "El Paraíso de Dios",
      description: "Arreglos florales y detalles que honran el amor eterno.",
      image: im4,
      logo: logo4,
      variant: "card-variant-4",
      colors: ["#e91e63", "#fce4ec", "#ffffff"],
    },
    {
      title: "No los Atropelles",
      description:
        "Concientización, cuidado y protección para los animales callejeros.",
      image: im5,
      logo: logo5,
      variant: "card-variant-5",
      colors: ["#27ae60", "#e8f5e8", "#ffffff"],
    },
  ];

  const containerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);
  const [floatingLights, setFloatingLights] = useState([]);

  // Generar luces flotantes
  useEffect(() => {
    const lights = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 10,
    }));
    setFloatingLights(lights);
  }, []);

  // Detectar scroll para cambiar de card
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cardHeight = container.clientHeight;
      const currentCard = Math.floor(scrollTop / cardHeight);
      setActiveCard(
        Math.min(Math.max(currentCard, 0), cardsData.length - 1)
      );
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardsData.length]);

  return (
    <div 
      ref={containerRef}
      className="position-relative bg-dark text-white scroll-trigger-animation"
      style={{ 
        height: height,
        scrollSnapType: 'y mandatory',
        borderRadius: '0.5rem'
      }}
    >
      <div style={{ height: `${cardsData.length * 100}%` }}>
      
        {cardsData.map((card, i) => (
          <div
            key={i}
            className="position-relative w-100 d-flex align-items-center justify-content-center"
            style={{
              height: height,
              scrollSnapAlign: 'start',
              background: '#1a1a1a'
            }}
          >
            {/* Floating Lights */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
              {floatingLights.map((light) => (
                <span
                  key={light.id}
                  className="position-absolute rounded-circle"
                  style={{
                    top: `${light.top}%`,
                    left: `${light.left}%`,
                    width: `${light.size}px`,
                    height: `${light.size}px`,
                    background: `radial-gradient(circle, ${card.colors[0]}80, transparent)`,
                    opacity: activeCard === i ? 0.6 : 0.3,
                    animation: activeCard === i ? `pulse ${3 + Math.random() * 4}s infinite` : 'none',
                    animationDelay: `${light.delay}s`,
                    boxShadow: `0 0 ${light.size * 2}px ${card.colors[0]}40`,
                    transition: 'opacity 0.5s ease'
                  }}
                />
              ))}
            </div>

            {/* Background Image */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.3) blur(0.5px)',
                transform: activeCard === i ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 1s ease',
                borderRadius: '0.5rem'
              }}
            />

            {/* Gradient Overlay */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                opacity: 0.7,
                background: `linear-gradient(135deg, ${card.colors[0]}20, ${card.colors[1]}10, transparent 60%)`,
                borderRadius: '0.5rem'
              }}
            />

            {/* Content */}
            <div className="position-relative z-3 text-center p-4">
              <div 
                style={{
                  maxWidth: '45rem',
                  transition: 'all 0.8s ease',
                  transform: activeCard === i ? 'translateY(0) scale(1)' : 'translateY(2rem) scale(0.95)',
                  opacity: activeCard === i ? 1 : 0.7
                }}
              >
                {/* Header with Logo */}
                <div className="d-flex align-items-center justify-content-center mb-3 gap-3">
                  <div 
                    className="rounded-circle border border-3 shadow"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      backgroundImage: `url(${card.logo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderColor: card.colors[0],
                      boxShadow: `0 0 25px ${card.colors[0]}40`
                    }}
                  />
                  <h2 
                    className="display-4 fw-bold mb-0"
                    style={{
                      background: `linear-gradient(45deg, ${card.colors[0]}, ${card.colors[2]})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
                    }}
                  >
                    {card.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="fs-5 text-white lh-base fw-light mx-auto mb-4" 
                   style={{ 
                     maxWidth: '50rem',
                     filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.7))'
                   }}>
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollTrigger;