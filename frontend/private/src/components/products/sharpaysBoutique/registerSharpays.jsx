// src/pages/ImageUploadPage.jsx
import React, { useState, useEffect } from "react";
import UploadImage from "../../ProductsImage";
import ImagePreview from "../../ImagePreview";
import ComboBox from "../../ComboBox";
import CustomInput from "../../CustomInput";
import SizeSelector from "../../SizeSelector";
import { Title, Subtitle } from "../../Typography";
import CustomButton from "../../CustomButton";
import "../../../styles/registerSharpays.css";

const ImageUploadPage = ({
  name,
  setName,
  description,
  setDescription,
  stock,
  setStock,
  price,
  setPrice,
  categoryId,
  setCategoryId,
  subCategoryId,
  setSubCategoryId,
  image,
  setImage,
  otherFields,
  setOtherFields,
  handleSubmit,
  selectedSizes,
  setSelectedSizes,
  tipoObjeto,
  setTipoObjeto,
  isEditing,
  handleUpdate,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({}); // Estado para manejar errores

  // Sincronizar imagen existente con preview
  useEffect(() => {
    if (image) {
      setImageUrl(image);
    }
  }, [image]);

  // Sincronizar valores del formulario al cambiar
  useEffect(() => {
    setCategoryId("6855bf0c8bda3da90eca92c4"); // ← ID de la tienda
    setSubCategoryId(tipoObjeto);
    setImage(imageUrl);
    setOtherFields({
      size: selectedSizes,
    });
  }, [tipoObjeto, selectedSizes, imageUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El título es requerido.";
    if (!price) newErrors.price = "El precio es requerido.";
    if (!stock) newErrors.stock = "El stock es requerido.";
    if (selectedSizes.length === 0)
      newErrors.sizes = "Debes seleccionar al menos una talla.";
    if (!description) newErrors.description = "La descripcion es requerida.";
    if (!tipoObjeto) newErrors.tipoObjeto = "La categoria es requerida.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        handleUpdate(); // Sin pasar el evento
      } else {
        handleSubmit(); // Sin pasar el evento
      }
    }
  };

  return (
    <div>
      <div className="main-container d-flex">
        <div className="upload-box">
          <UploadImage
            onUpload={(url) => {
              setImageUrl(url);
              setImage(url);
            }}
          />
        </div>
        <div className="preview-box">
          <ImagePreview imageUrl={imageUrl} />
        </div>
      </div>

      <form
        className="w-full max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-md p-8"
        onSubmit={handleFormSubmit} // Cambia aquí
      >
        <Subtitle>Selecciona la subcategoría</Subtitle>
        <ComboBox
          value={tipoObjeto}
          onChange={(e) => setTipoObjeto(e.target.value)}
          categoryFilter="6855bf0c8bda3da90eca92c4"
        />
        {errors.tipoObjeto && (
          <p style={{ color: "pink" }}>{errors.tipoObjeto}</p>
        )}

        <div className="mt-6">
          <Subtitle>Detalles</Subtitle>
          <div className="form-row">
            <div className="input-titulo">
              <CustomInput
                label="Título"
                placeholder="Título"
                type="text"
                name="titulo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p style={{ color: "pink" }}>{errors.name}</p>}{" "}
              {/* Mensaje de error */}
            </div>
            <div className="input-precio">
              <CustomInput
                label="Precio"
                placeholder="Precio"
                type="number"
                name="precio"
                value={price}
                onChange={(e) => {
                  const val = e.target.value;

                  // Validar si es número positivo mayor que 0
                  if (!/^\d*\.?\d*$/.test(val)) {
                    setErrors((prev) => ({
                      ...prev,
                      price: "Solo se permiten números positivos.",
                    }));
                  } else if (parseFloat(val) <= 0) {
                    setErrors((prev) => ({
                      ...prev,
                      price: "El precio debe ser mayor que 0.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, price: "" }));
                  }

                  setPrice(val);
                }}
              />
              {errors.price && <p style={{ color: "pink" }}>{errors.price}</p>}
            </div>
            <div className="input-stock">
              <CustomInput
                label="Stock"
                placeholder="Stock"
                type="number"
                name="stock"
                value={stock}
                onChange={(e) => {
                  const val = e.target.value;

                  // Solo números enteros positivos
                  if (!/^\d+$/.test(val)) {
                    setErrors((prev) => ({
                      ...prev,
                      stock: "Solo se permiten números enteros positivos.",
                    }));
                  
                  } else {
                    setErrors((prev) => ({ ...prev, stock: "" }));
                  }

                  setStock(val);
                }}
              />
              {errors.stock && <p style={{ color: "pink" }}>{errors.stock}</p>}
            </div>

            <div className="input-tallas">
              <label className="text-sm font-semibold mb-1 block">
                Tallas disponibles
              </label>
              <SizeSelector
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
              {errors.sizes && <p style={{ color: "pink" }}>{errors.sizes}</p>}{" "}
              {/* Mensaje de error */}
            </div>
          </div>

          <div className="input-descripcion">
            <CustomInput
              label="Descripción"
              placeholder="Descripción"
              type="text"
              name="descripcion"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* Alerta si hay menos de 10 caracteres */}
            {description.length > 0 && description.length < 10 && (
              <div
                style={{
                  backgroundColor: "#ffe0e0",
                  color: "#ffffff",
                  padding: "8px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                La descripción debe tener al menos 10 caracteres.
              </div>
            )}

            {errors.description && (
              <p style={{ color: "pink" }}>{errors.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <CustomButton
            text={isEditing ? "Actualizar" : "Agregar"}
            background={isEditing ? "#FD0053" : "black"}
            color="white"
            width="180px"
            height="50px"
            border={isEditing ? "none" : "none"}
          />
        </div>
      </form>
    </div>
  );
};

export default ImageUploadPage;
