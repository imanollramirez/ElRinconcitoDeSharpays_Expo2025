import React, { useState, useRef, useEffect } from "react";
import SizeSelector from "../Size";
import QuantitySelector from "../QuantitySelector";
import useDataShoppingCart from "../../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import "../../styles/CamisaDetail.css";
import SuccessAlert from "../../components/SuccessAlert.jsx";
import { useNavigate } from "react-router-dom";

const CamisaDetail = ({ product }) => {
  const navigate = useNavigate();
  const zoomRef = useRef(null);
  const { addToCart } = useDataShoppingCart();

  const CAMISA_SUBCATEGORY_ID = "6855bf4a8bda3da90eca92c6";
  
  // Verificar si es camisa comparando el subCategoryId
  // El subCategoryId viene como objeto populated, necesitamos acceder al _id
  const isCamisa = product.subCategoryId?._id === CAMISA_SUBCATEGORY_ID || 
                   String(product.subCategoryId) === CAMISA_SUBCATEGORY_ID;
  
  // Solo inicializar selectedSize si es camisa Y tiene sizes disponibles
  const [selectedSize, setSelectedSize] = useState(() => {
    if (isCamisa && product.size && Array.isArray(product.size) && product.size.length > 0) {
      return product.size[0];
    }
    return "";
  });
  
  const [quantity, setQuantity] = useState(1);

  const handleSizeChange = (size) => setSelectedSize(size);
  const handleQuantityChange = (qty) => setQuantity(qty);

  const handleAddToCart = () => {
    // Solo validar talla si es camisa
    if (isCamisa && !selectedSize) {
      alert("Por favor selecciona una talla");
      return;
    }

    const productWithDetails = {
      ...product,
      // Solo agregar size si es camisa
      ...(isCamisa && selectedSize ? { size: selectedSize } : {}),
    };

    SuccessAlert("Se agregó al carrito");
    addToCart(productWithDetails, quantity);
    navigate("/carrito");
  };

  const handleCustomizeShirt = () => {
    // Solo validar talla si es camisa antes de personalizar
    if (isCamisa && !selectedSize) {
      alert("Por favor selecciona una talla antes de personalizar");
      return;
    }

    const productData = {
      name: product.name,
      price: product.price,
      description: product.description,
      selectedSize: isCamisa ? selectedSize : null,
      quantity,
      // Agregar el subCategoryId para identificar el tipo de producto
      subCategoryId: product.subCategoryId?._id || String(product.subCategoryId),
    };

    console.log("Enviando datos:", productData);
    console.log("Es camisa:", isCamisa);

    if (isCamisa) {
      // Si es camisa, ir al preview
      console.log("Navegando a preview para camisa");
      navigate("/preview-customization", { state: productData });
    } else {
      // Si NO es camisa (ej: taza), ir directamente al editor
      console.log("Navegando directamente al editor para producto que no es camisa");
      navigate("/TshirtDesign", { state: productData });
    }
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

  // Debug: Solo ejecutar una vez usando useEffect
  React.useEffect(() => {
    console.log("=== DEBUG COMPLETO DEL PRODUCTO ===");
    console.log("Product completo:", product);
    console.log("Product keys:", Object.keys(product));
    console.log("Product subCategoryId:", product.subCategoryId);
    console.log("Product subcategoryId:", product.subcategoryId); // minúscula
    console.log("Product subCategory:", product.subCategory); // sin Id
    console.log("Tipo de subCategoryId:", typeof product.subCategoryId);
    console.log("String conversion:", String(product.subCategoryId));
    console.log("CAMISA_SUBCATEGORY_ID:", CAMISA_SUBCATEGORY_ID);
    console.log("Comparación ===:", String(product.subCategoryId) === CAMISA_SUBCATEGORY_ID);
    console.log("Is Camisa:", isCamisa);
    console.log("Product size:", product.size);
    console.log("Product sizes:", product.sizes); // por si está en plural
    console.log("======================================");
  }, []);

  return (
    <>
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

        {isCamisa && (
          <SizeSelector
            sizes={product.size}
            selectedSize={selectedSize}
            onChange={handleSizeChange}
          />
        )}

        <QuantitySelector
          max={product.stock}
          quantity={quantity}
          onChange={handleQuantityChange}
        />

        <div className="buttons-container">
          <button className="customize-btn" onClick={handleCustomizeShirt}>
            Personaliza tu producto
          </button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default CamisaDetail;