import React, { useState, useRef } from "react";
import QuantitySelector from "../QuantitySelector";
import useDataShoppingCart from "../../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import "../../styles/CamisaDetail.css"; // reutilizamos estilos

import {useNavigate} from "react-router-dom"

import SuccessAlert from "../../components/SuccessAlert.jsx";

const PaletaDetail = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const zoomRef = useRef(null);

  const { addToCart } = useDataShoppingCart();

  const handleQuantityChange = (qty) => setQuantity(qty);

  const handleAddToCart = () => {
    // Crear objeto con sabor para diferenciar en el carrito
    const productWithFlavor = { ...product, flavor: product.flavor };
    SuccessAlert("Se agregó al carrito");
    addToCart(productWithFlavor, quantity);
    navigate("/carrito");
  };

  const handleMouseMove = (e) => {
    const zoomContainer = zoomRef.current;
    const rect = zoomContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    zoomContainer.classList.add("active");
    zoomContainer.querySelector("img").style.transformOrigin = `${xPercent}% ${yPercent}%`;
  };

  const handleMouseLeave = () => {
    const zoomContainer = zoomRef.current;
    zoomContainer.classList.remove("active");
    zoomContainer.querySelector("img").style.transformOrigin = `center center`;
  };

  const getColorByFlavor = (flavor) => {
    const flavorLower = flavor.toLowerCase();
    if (flavorLower.includes("fresa")) return "red";
    if (flavorLower.includes("chocolate")) return "brown";
    if (flavorLower.includes("oreo")) return "gray";
    if (flavorLower.includes("limón") || flavorLower.includes("lima")) return "green";
    return stringToColor(flavor);
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
  };

  return (<>
  <div className="camisa-detail-container">
    <div className="camisa-detail-wrapper">
      <div className="camisa-image-container">
        <div
          className="camisa-image-wrapper zoom-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={zoomRef}
        >
          <img
            src={product.image}
            alt={product.name}
            className="camisa-image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="camisa-info-container">
        <h1 className="camisa-name">{product.name}</h1>
        <p className="camisa-description">{product.description}</p>
        <p className="camisa-price">${product.price.toFixed(2)}</p>

        <p
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: getColorByFlavor(product.flavor),
            backgroundColor: "#f3f3f3",
            padding: "8px 16px",
            borderRadius: "12px",
            width: "fit-content",
            marginTop: "8px",
          }}
        >
          Sabor: {product.flavor}
        </p>

        <QuantitySelector
          max={product.stock}
          quantity={quantity}
          onChange={handleQuantityChange}
        />

        <button className="add-cart-btn" onClick={handleAddToCart}>
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
  </>
  );
};

export default PaletaDetail;
