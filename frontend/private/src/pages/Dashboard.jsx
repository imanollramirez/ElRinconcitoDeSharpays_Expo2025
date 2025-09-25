import { useAuth } from "../context/AuthContext.jsx";
import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";

import "../styles/Dashboard.css";

import ProductsTable from "../components/products/dashboardTable.jsx";
import useUserDataProducts from "../components/products/hook/userDataProducts";

//Gráficas
import BarChart from "../utils/barGraphic.jsx";
import Doughnut from "../utils/doughnut.jsx";

import TotalSales from "../components/TotalSales.jsx";
import StoreCard from "../components/StoreCard.jsx";

import useDataCategory from "../components/categories/hook/useDataCategory.jsx";

import useDataEmployee from "../components/employee/hook/useDataEmployee.jsx";
import Aurora from '../components/Aurora.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const dataEmployees = useDataEmployee();
  const dataProducts = useUserDataProducts();
  const dataCategories = useDataCategory(); //Stores

  useEffect(() => {
    dataProducts.fetchData();
    dataEmployees.fetchEmployeesById(user?.id);
  }, [user?.id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            {/*Espacio para que el navbar se muestre*/}
          </div>
          <div className="col-10 main-dashboard">
  <div className="card shadow-sm border-0 rounded-3 position-relative overflow-hidden">
    {/* Fondo Aurora */}
    <div className="position-absolute top-0 start-0 w-100 h-100">
      <Aurora
        colorStops={["#DD92DB", "#F0A3C4", "#E864CB"]}
        blend={0.98}
        amplitude={1.9}
        speed={0.9}
        shadowMode={false} 
      />
    </div>

    {/* Contenido encima del fondo */}
    <div className="card-body position-relative text-black">
      <div className="d-flex justify-content-between align-items-center">
        {/* Sección de bienvenida */}
        <div className="mt-3 user-name-section">
          <h4 className="fw-bold fs-2">Bienvenid@ {dataEmployees?.name}</h4>
        </div>

        {/* Imagen de perfil */}
        <div className="pf-cover">
          <NavLink to={"/profile"}>
            <img
              src={dataEmployees?.imageUrl}
              className="rounded-circle me-1 border border-1 border-light"
              alt=""
              width="30"
              height="30"
              style={{ objectFit: "cover" }}
            />
          </NavLink>
        </div>
      </div>
      
    </div>
  </div>


            

            <hr style={{ width: '100%' }} />

              {/*
            <div className="grahpics d-flex justify-content-around">
              <div className="bar-chart">
                <h4>Productos más vendidos</h4>
                <BarChart />
              </div>

              <div className="total-sales">
                <h4>Ventas por mes</h4>
                <TotalSales />
              </div>

              <div>
                <div
                  className="gif-animation"
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <img
                    src="https://cdn.dribbble.com/userupload/5509318/file/original-9fcb4efd061af4c6eb3c0b056bda48d1.gif"
                    style={{ width: "420px", opacity: 0.9 }}
                  />
                </div>
              </div>
            </div>
              */}
            

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="product-list-dashboard w-100">
                <h4>Lista de productos</h4>
                <ProductsTable {...dataProducts} isEditable={false} />
              </div>
              <div className="sales-by-shop">
                <h4>Productos por negocio</h4>
                <Doughnut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
