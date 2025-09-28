import React from "react";
import InputText from "../CustomInput";
import Button from "../CustomButton";
import "../../styles/ProductsTable.css";

const dashboardTable = ({ products, loading}) => {
  return (
    <div className="products-table-container">
      <div className="card-table">
        

        <div className={`table-header-row`}>
          <span>Nombre</span>
          <span>Descripción</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Imagen</span>
          <span>Tallas</span>
        </div>

        <div className="table-body">
          {loading ? (
            <div>Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center pt-5">No hay productos para mostrar</div>
          ) : (
            products.map((prod) => (
              <div key={prod._id} className={`table-item`}>
                <span>{prod.name}</span>
                <span>{prod.description}</span>
                <span>${prod.price}</span>
                <span>{prod.stock}</span>
                <span>
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt="Producto"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "8px",
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

                <span>
                  {Array.isArray(prod.size) && prod.size.length > 0
                    ? prod.size.join(", ")
                    : "—"}
                </span>
              </div>
            ))
          )}
        </div>


      </div>
    </div>
  );
};

export default dashboardTable;
