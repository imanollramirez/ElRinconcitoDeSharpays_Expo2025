import React from "react";
import { useLocation } from "react-router-dom";
import TShirtDesigner from "../components/TshirtDesigner/TshirtDesigner";
import "../styles/Tshirt.css";

const TshirtDesign = () => {
  const location = useLocation();
  const { state } = location;


  // Verifica qué estás recibiendo
  console.log("Datos recibidos en TshirtDesign:", state);

  const product = state || {}; // Usamos un objeto vacío por defecto

  return (
    <div className="app">
      <h1>Personalizador de Camisetas</h1>
      {/* Pasa el producto como prop a TShirtDesigner */}
      <TShirtDesigner product={product} />
    </div>
  );
};

export default TshirtDesign;
