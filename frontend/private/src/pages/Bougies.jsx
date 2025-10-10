// src/pages/SharpaysPage.jsx
import React, { useState, useEffect } from "react";
import ImageUploadPage from "../components/products/bougies/registerBougies"; // Componente para registrar productos
import ProductsTable from "../components/products/bougies/bougiesTable"; // Tabla para mostrar productos
import { Title } from "../components/Typography"; // Componente de título
import "../styles/SharpayPage.css"; // Estilos propios de la página
import useUserDataProducts from "../components/products/hook/userDataProducts"; // Hook personalizado para manejar productos

import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import QuestionAlert from "../components/QuestionAlert.jsx";

const SharpaysPage = () => {
  // Estado para manejar la pestaña activa
  const [activeTab, setActiveTab] = useState("agregar");
  // Estado para verificar si se está en modo edición
  const [isEditing, setIsEditing] = useState(false);

  // Hook personalizado que provee datos y funciones para manejar productos
  const {
    name, setName,
    description, setDescription,
    stock, setStock,
    price, setPrice,
    categoryId, setCategoryId,
    subCategoryId, setSubCategoryId,
    image, setImage,
    handleSubmit,
    handleUpdate,
    selectedSizes, setSelectedSizes,
    tipoObjeto, setTipoObjeto,
    products,
    deleteProduct,
    updateProduct,
    loading,
    fetchData
  } = useUserDataProducts();

  // Se ejecuta al montar el componente para obtener los productos
  useEffect(() => {
    fetchData();
  }, []);

  // Función para preparar el producto en modo edición
  const handleEdit = (prod) => {
    updateProduct(prod);
    setIsEditing(true);
    setActiveTab("agregar");
  };

  // ⚡ Nuevo: función de eliminar con confirmación
  const handleDelete = async (id) => {
    const result = await QuestionAlert("¿Estás seguro de eliminar este producto?");
    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        SuccessAlert("Producto eliminado exitosamente");
      } catch (err) {
        ErrorAlert("Error al eliminar producto: " + (err.message || err));
      }
    }
  };

  return (
    <>
    <div className="container-fluid">
      <div className="row">
        <div className="col-2"></div> {/* Columna vacía para margen */}
        <div className="col-10">
    <div className="sharpay-page">
      <Title>Bougies</Title> {/* Título principal */}

      {/* Sección de pestañas */}
      <div className="custom-tabs">
        <div
          className={`tab ${activeTab === "agregar" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("agregar");
            setIsEditing(false); // Si cambia a esta pestaña se reinicia el modo edición
          }}
        >
          Agregar
        </div>
        <div
          className={`tab ${activeTab === "vista" ? "active" : ""}`}
          onClick={() => setActiveTab("vista")}
        >
          Vista
        </div>
      </div>

      {/* Si la pestaña activa es "agregar", se muestra el formulario */}
      {activeTab === "agregar" && (
        <ImageUploadPage
          name={name} setName={setName}
          description={description} setDescription={setDescription}
          stock={stock} setStock={setStock}
          price={price} setPrice={setPrice}
          categoryId={categoryId} setCategoryId={setCategoryId}
          subCategoryId={subCategoryId} setSubCategoryId={setSubCategoryId}
          image={image} setImage={setImage}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes}
          tipoObjeto={tipoObjeto} setTipoObjeto={setTipoObjeto}
          isEditing={isEditing} // Se pasa el estado de edición
        />
      )}

      {/* Si la pestaña activa es "vista", se muestra la tabla de productos */}
      {activeTab === "vista" && (
        <ProductsTable
          products={products}
          deleteProduct={handleDelete}   
          updateProduct={handleEdit}
          loading={loading}
        />
      )}
    </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SharpaysPage; // Exporta el componente principal
