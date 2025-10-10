import React, { useState, useRef } from "react";
import {useNavigate} from "react-router-dom"
import SizeSelector from "../Size";
import QuantitySelector from "../QuantitySelector";
import useDataShoppingCart from "../../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import "../../styles/CamisaDetail.css";
import SuccessAlert from "../../components/SuccessAlert.jsx";

const CamisaDetail = ({ product }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const zoomRef = useRef(null);

  const { addToCart } = useDataShoppingCart();

  const hasSize = Array.isArray(product.size) && product.size.length > 0;

  const handleAddToCart = () => {
    const options = {};
    if (hasSize) {
      if (!selectedSize) return; // si necesita talla, pero no se seleccionó
      options.size = selectedSize;
    } else if (product.flavor) {
      options.flavor = product.flavor;
    }

    SuccessAlert("Se agregó al carrito");
    addToCart(product, quantity, options);
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

        {hasSize && (
          <SizeSelector
            sizes={product.size}
            selectedSize={selectedSize}
            onChange={setSelectedSize}
          />
        )}

        <QuantitySelector
          max={product.stock}
          quantity={quantity}
          onChange={setQuantity}
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

export default CamisaDetail;
