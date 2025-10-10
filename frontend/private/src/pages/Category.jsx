import React from "react";
import RegisterCategories from "../components/categories/registerCategory.jsx"; // Componente para registrar categorías
import CategoryTable from "../components/categories/categoryTable.jsx"; // Tabla para mostrar categorías
import useDataCategories from "../components/categories/hook/useDataCategory.jsx"; // Hook personalizado para manejar datos de categorías
import "../styles/Category.css"; // Estilos propios de la página de categorías

const CategoryPage = () => {
  // Se obtiene la lógica y estados del hook personalizado
  const data = useDataCategories();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2"></div> {/* Columna vacía para margen */}
        <div className="col-10">
          <div className="users-main-container">
            <h1 className="main-title">Tiendas Sharpay</h1> {/* Título de la página */}
            
            {/* Sección del formulario para registrar categorías */}
            <div className="form-and-fields">
              <RegisterCategories {...data} resetForm={data.resetForm} />
            </div>
            
            {/* Sección de la tabla que lista las categorías registradas */}
            <div className="users-table-wrapper">
              <CategoryTable {...data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 
