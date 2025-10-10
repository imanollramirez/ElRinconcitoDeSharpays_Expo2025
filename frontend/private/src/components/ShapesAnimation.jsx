import React, { useMemo } from "react";

// Componente para animación de formas en el fondo
// Genera formas aleatorias (círculos y triángulos) con animaciones
const ShapesAnimation = ({NUM_SHAPES}) => {

    const randomPosition = () => Math.random() * 100 + "%";

    const shapes = useMemo(() =>
    Array.from({ length: NUM_SHAPES }, () => ({
      top: randomPosition(),
      left: randomPosition(),
      size: 30 + Math.random() * 60,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 10,
      type: Math.random() > 0.5 ? "circle" : "triangle",
      direction: Math.random() > 0.5 ? "normal" : "reverse",
    })), []
  );

    return (
        <>
         {
    shapes.map((shape, i) => (
      <div
        key={`shape-${i}`}
        className={`shape ${shape.type}`}
        style={{
          top: shape.top,
          left: shape.left,
          width: shape.size + "px",
          height: shape.size + "px",
          animationDuration: shape.duration + "s",
          animationDelay: shape.delay + "s",
          animationDirection: shape.direction,
        }}
      />
    ))
  }
        </>
    );
};

export default ShapesAnimation;