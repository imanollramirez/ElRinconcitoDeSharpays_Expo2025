import React, { useState } from "react";
import "../components/productCardItem.css";
import { FaTrash } from 'react-icons/fa';

const ProductCartItem = ({ item, removeFromCart, updateQuantity }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { product, quantity } = item;
  const { name, price, image, description, size, flavor, customDesign, duaData } = product;

  const handleRemove = () => removeFromCart(item.key);

  const productImage = duaData?.carnetImage || customDesign || image || product?.baseImage || "https://via.placeholder.com/160x200?text=Sin+Foto";
  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

  // +/- buttons
  const incrementQuantity = () => updateQuantity(item, quantity + 1);
  const decrementQuantity = () => {if (quantity > 1) updateQuantity(item, quantity - 1);};

  return (
    <>
      <div className="cart-card">
        <button className="remove-btn" onClick={handleRemove}>
          <FaTrash size={20} color="#ff6daa" />
        </button>

        <div className="cart-image">
          <img src={productImage} alt={name} onClick={togglePreview} style={{ cursor: "pointer" }} />
        </div>

        <div className="cart-info">
          <h4 className="cart-title">{name}</h4>
          {description && <p className="cart-description">{description}</p>}
          {size && <p><strong>Talla:</strong> {size}</p>}
          {flavor && <p><strong>Sabor:</strong> {flavor}</p>}

          <div className="cart-quantity">
            <span>Cantidad: </span>
            <button className="custom-btn" onClick={decrementQuantity} style={{ padding: "4px 8px" }}>-</button>
            <input
              type="text"
              min="1"
              value={quantity}
              onChange={(e) => updateQuantity(item, parseInt(e.target.value, 10) || 1)}
              className="qty-input"
            />
             <button className="custom-btn" onClick={incrementQuantity} style={{ padding: "4px 8px" }}>+</button>
          </div>

          <div className="cart-price">${(price * quantity).toFixed(2)}</div>
        </div>
      </div>

      {isPreviewOpen && (
        <div
          className="image-preview-overlay"
          onClick={togglePreview}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={productImage}
            alt="Vista previa"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px", boxShadow: "0 0 15px rgba(255,255,255,0.4)" }}
          />
        </div>
      )}
    </>
  );
};

export default ProductCartItem;
