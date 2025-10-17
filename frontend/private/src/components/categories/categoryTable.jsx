import React, { useState } from "react";
import InputText from "../CustomInput";
import Button from "../CustomButton";
import "../../styles/Employee.css"; // O usa tu CSS general

// Verifica URL de imagen
const isValidImageUrl = (url) => {
  return typeof url === "string" && url.startsWith("http");
};

const CategoryTable = ({ categories, deleteCategory, updateCategory, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emps-table-section">
      <div className="table-card">
        {/* Búsqueda funcional */}
        <div className="search-container">
          <InputText
            type="text"
            name="buscar"
            placeholder="Buscar categorías"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Encabezado Acciones */}
   

        {/* Tabla con scroll */}
        <div className="table-scroll-wrapper">
          <div className="table-header-row">
            <span>Descripción</span>
            <span>Categoría</span>
            <span>Imagen</span>
            <span>Activo</span>
            <span>Acciones</span>
          </div>

          <div className="table-body">
            {loading ? (
              <div>Cargando categorías...</div>
            ) : filteredCategories.length === 0 ? (
              <div>No hay categorías para mostrar</div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat._id} className="table-item">
                  <span>{cat.description}</span>
                  <span>{cat.category}</span>
                  <span>
                    {isValidImageUrl(cat.image) ? (
                      <img
                        src={cat.image}
                        alt="Imagen categoría"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                          background: "#fff",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "8px",
                          backgroundColor: "#ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          color: "#555",
                          userSelect: "none",
                        }}
                      >
                        Sin imagen
                      </div>
                    )}
                  </span>
                  <span>{cat.isActive ? "Sí" : "No"}</span>
                  <div className="action-buttons-container">
                    <Button
                      text="Editar"
                      background="#FD0053"
                      color="white"
                      height="32px"
                      width="80px"
                      className="action-button-edit"
                      onClick={() => updateCategory(cat)}
                    />
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
