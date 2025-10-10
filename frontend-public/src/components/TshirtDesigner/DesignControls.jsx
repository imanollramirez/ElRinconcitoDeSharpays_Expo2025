// DesignControls.jsx
import React from "react";
import useDataShoppingCart from "../shoppingCart/hooks/useDataShoppingCart";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";
import { useNavigate } from "react-router-dom";

const DesignControls = ({
  onImageUpload,
  onDelete,
  hasSelection,
  fileInputRef,
  isLoading,
  fabricCanvas,
  exportDesign,
  product,
}) => {
  const { addToCart } = useDataShoppingCart();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!isLoading) fileInputRef.current.click();
  };

  const handleAddToCart = async () => {
    if (!fabricCanvas || fabricCanvas.getObjects().length === 0) {
      ErrorAlert("No hay diseño para agregar.");
      return;
    }
    if (!exportDesign) {
      ErrorAlert("Función exportDesign no disponible.");
      return;
    }

    
    try {
      const finalImage = await exportDesign();

      const TAZA_SUBCATEGORY_ID = "68af2494a7e54f57647273ab";
      const isTaza = product?.subCategoryId === TAZA_SUBCATEGORY_ID;


      console.log("Producto actual:", product);
    console.log("isTaza:", isTaza);

      const customProduct = {
        _id: `custom-${Date.now()}`,
        name: product?.name || (isTaza ? "Taza Personalizada" : "Camiseta Personalizada"),
        price: product?.price || 15.99,
        image: finalImage,
        customDesign: finalImage, // Base64 del diseño
        baseImage: isTaza ? "/images/Taza.png" : "/images/dualchemis.png", // ✅ CLAVE
        description: product?.description || "Diseño único creado en el editor",
        size: product?.selectedSize || null,
        flavor: null,
        isCustom: true,
        subCategoryId: product?.subCategoryId || null,
        isTaza: isTaza,
      };
     


      addToCart(customProduct, 1);
      SuccessAlert("Diseño agregado al carrito");
      navigate("/carrito");
    } catch (err) {
      console.error("Error al exportar el diseño:", err);
      ErrorAlert("No se pudo agregar el diseño al carrito");
    }
  };

  return (
    <div className="design-controls-panel">
      <h3>Controles de Diseño</h3>

      <div className="upload-section">
        <button
          onClick={handleUploadClick}
          className="upload-button-soft"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Cargar tu diseño"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/svg+xml,image/gif"
          onChange={onImageUpload}
          style={{ display: "none" }}
        />
        <p className="upload-hint">Formatos: JPG, PNG, SVG, GIF (máx. 10MB)</p>
      </div>

      <button
        onClick={onDelete}
        className="delete-button-black"
        disabled={!hasSelection}
      >
        {hasSelection
          ? "Eliminar diseño seleccionado"
          : "Selecciona un elemento para eliminar"}
      </button>

      <div className="price-section">
        <p className="price">
          Precio: ${product?.price ? product.price.toFixed(2) : "Precio no disponible"}
        </p>
        <button className="add-to-cart" onClick={handleAddToCart}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default DesignControls;
