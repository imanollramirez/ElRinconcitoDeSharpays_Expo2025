// src/pages/frostybites.jsx
import React, { useState, useEffect } from "react";
import ImageUploadPage from "../components/products/frostyBites/regiterFrostyBites"; 
import ProductsTable from "../components/products/frostyBites/frostyTable";
import { Title } from "../components/Typography";
import "../styles/SharpayPage.css";
import useUserDataProducts from "../components/products/hook/userDataProducts";

import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import QuestionAlert from "../components/QuestionAlert.jsx";

const FrostyBites = () => {
  const [activeTab, setActiveTab] = useState("agregar");
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    name, setName,
    description, setDescription,
    stock, setStock,
    price, setPrice,
    categoryId, setCategoryId,
    subCategoryId, setSubCategoryId,
    image, setImage,
    otherFields, setOtherFields,
    flavor,setFlavor,
    tipoObjeto, setTipoObjeto,
    handleSubmit,
    handleUpdate,
    products,
    deleteProduct,
    updateProduct,
    loading,
    fetchData
  } = useUserDataProducts();

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (prod) => {
    updateProduct(prod); // ¡Aquí sí se setea el ID!
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
          <div className="col-2"></div>
          <div className="col-10">
            <div className="sharpay-page">
              <Title>FrostyBites</Title>

              <div className="custom-tabs">
                <div
                  className={`tab ${activeTab === "agregar" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("agregar");
                    setIsEditing(false); // reset editar al cambiar pestaña
                    setFlavor(""); // reset flavor también al cambiar tab
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

              {activeTab === "agregar" && (
                <ImageUploadPage
                  name={name} setName={setName}
                  description={description} setDescription={setDescription}
                  stock={stock} setStock={setStock}
                  price={price} setPrice={setPrice}
                  categoryId={categoryId} setCategoryId={setCategoryId}
                  subCategoryId={subCategoryId} setSubCategoryId={setSubCategoryId}
                  image={image} setImage={setImage}
                  otherFields={otherFields} setOtherFields={setOtherFields}
                  flavor={flavor} setFlavor={setFlavor}   // <--- PASAR ESTADO FLAVOR
                  handleSubmit={handleSubmit}
                  handleUpdate={handleUpdate}
                  tipoObjeto={tipoObjeto} setTipoObjeto={setTipoObjeto}
                  isEditing={isEditing}
                />
              )}
              {activeTab === "vista" && (
                <ProductsTable
                  products={products}
                  deleteProduct={handleDelete}   // <-- aquí ahora con confirmación
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

export default FrostyBites;
