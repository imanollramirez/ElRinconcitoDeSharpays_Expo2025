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
import useDataCustomer from "../components/customer/useDataCustomer.jsx";
import useOrdersWithCategories from "../components/order/hook/useOrders.jsx";

import Aurora from '../components/Aurora.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const dataEmployees = useDataEmployee();
  const dataProducts = useUserDataProducts();
  const dataCategories = useDataCategory(); //Stores
  const { customers } = useDataCustomer();
  const { orders } = useOrdersWithCategories();

  useEffect(() => {
    dataProducts.fetchData();
    dataEmployees.fetchEmployeesById(user?.id);
  }, [user?.id]);

  // --- MÉTRICAS ---
  const totalClientes = customers?.length || 0;

  const pedidosPendientes = orders?.filter(
    (order) => order.status?.toLowerCase() === "pendiente"
  ).length || 0;

  const ventasTotales = orders?.filter(
    (order) => order.status?.toLowerCase() === "completado"
  ).length || 0;

  const gananciasTotales = orders
    ?.filter((order) => order.status?.toLowerCase() === "completado")
    ?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

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

                {/* Panel de métricas */}
                <div className="row mt-4 text-center">
                  <div className="col-md-3 mb-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm">
                      <h6 className="fw-bold text-muted">Clientes</h6>
                      <h4 className="fw-bold text-dark">{totalClientes}</h4>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm">
                      <h6 className="fw-bold text-muted">Pedidos Pendientes</h6>
                      <h4 className="fw-bold text-dark">{pedidosPendientes}</h4>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm">
                      <h6 className="fw-bold text-muted">Ventas Totales</h6>
                      <h4 className="fw-bold text-dark">{ventasTotales}</h4>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm">
                      <h6 className="fw-bold text-muted">Ganancias Totales</h6>
                      <h4 className="fw-bold text-dark">${gananciasTotales.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <hr style={{ width: "100%" }} />

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
