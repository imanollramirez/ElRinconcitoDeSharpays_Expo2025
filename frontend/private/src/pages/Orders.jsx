import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomTitle from "../components/CustomTitle";
import OrderCard from "../components/order/ordersCard.jsx";
import useOrdersWithCategories from "../components/order/hook/useOrders.jsx";
import "../styles/Orders.css";

const Orders = () => {
  const { orders, categories, loading, error, updateOrder } = useOrdersWithCategories();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showHistory, setShowHistory] = useState(false);
  const [filterType, setFilterType] = useState("month"); // day, month, year
  const [selectedDate, setSelectedDate] = useState("");

  const storeNames = ["Todos", ...categories.map((c) => c.category)];

  // Pedidos pendientes
  const filteredOrders = orders.filter(
    (order) =>
      (activeCategory === "Todos" || order.categoryId?.category === activeCategory) &&
      order.status !== "completado"
  );

  // Pedidos completados (historial) con filtro
  const completedOrders = orders.filter((order) => {
    const isCategoryMatch =
      activeCategory === "Todos" || order.categoryId?.category === activeCategory;
    const isCompleted = order.status === "completado";

    const orderDate = new Date(order.createdAt);

    if (!selectedDate) return isCategoryMatch && isCompleted;

    if (filterType === "day") {
      const selected = new Date(selectedDate);
      return (
        isCategoryMatch &&
        isCompleted &&
        orderDate.toDateString() === selected.toDateString()
      );
    }

    if (filterType === "month") {
      const [selectedYear, selectedMonth] = selectedDate.split("-").map(Number);
      return (
        isCategoryMatch &&
        isCompleted &&
        orderDate.getFullYear() === selectedYear &&
        orderDate.getMonth() + 1 === selectedMonth
      );
    }

    if (filterType === "year") {
      return (
        isCategoryMatch &&
        isCompleted &&
        orderDate.getFullYear() === parseInt(selectedDate)
      );
    }

    return isCategoryMatch && isCompleted;
  });

  const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Historial de Ventas", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${filterType === "day" ? "Día" : filterType === "month" ? "Mes" : "Año"}: ${
        selectedDate || "Todos"
      }`,
      14,
      30
    );

    const tableData = completedOrders.map((order) => [
      `#${order._id.slice(-4)}`,
      order.customerId?.name || "Sin nombre",
      `$${order.total.toFixed(2)}`,
    ]);

    tableData.push(["TOTAL", "", `$${totalSales.toFixed(2)}`]);

    autoTable(doc, {
      head: [["No. Orden", "Cliente", "Total ($)"]],
      body: tableData,
      startY: 50,
      theme: "striped",
      headStyles: {
        fillColor: [254, 63, 141],
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      styles: {
        cellPadding: 4,
        font: "helvetica",
        halign: "center",
      },
      didParseCell: (data) => {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220];
        }
      },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text("El Rinconcito de Sharpays©", 14, pageHeight - 10);

    doc.save(`Historial_Ventas_${selectedDate || "Todos"}.pdf`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <div className="orders-page">
            <div className="orders-wrapper">
              <div className="orders-content">
                <CustomTitle text="Pedidos" style="page-title" />

                <div className="store-tabs">
                  {storeNames.map((store) => (
                    <button
                      key={store}
                      className={`store-tab ${activeCategory === store ? "active" : ""}`}
                      onClick={() => setActiveCategory(store)}
                    >
                      {store}
                    </button>
                  ))}
                  <button
                    className={`store-tab ${showHistory ? "active" : ""}`}
                    style={{
                      marginLeft: "auto",
                      backgroundColor: showHistory ? "#FE3F8D" : "",
                      color: showHistory ? "#fff" : "",
                    }}
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    {showHistory ? "Volver a pendientes" : "Historial de ventas"}
                  </button>
                </div>

                {showHistory && (
                  <div className="history-filter">
                    <label>Filtrar por:</label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setSelectedDate("");
                      }}
                    >
                      <option value="day">Día</option>
                      <option value="month">Mes</option>
                      <option value="year">Año</option>
                    </select>

                    <input
                      type={
                        filterType === "day"
                          ? "date"
                          : filterType === "month"
                          ? "month"
                          : "number"
                      }
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      placeholder={filterType === "year" ? "YYYY" : ""}
                    />

                    <button onClick={generatePDF}>Descargar PDF</button>
                  </div>
                )}

                {loading ? (
                  <p>Cargando...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : showHistory ? (
                  completedOrders.length === 0 ? (
                    <p className="text-center">No hay órdenes completadas para esta tienda.</p>
                  ) : (
                    <div className="history-card">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>No. de Orden</th>
                            <th>Cliente</th>
                            <th>Total ($)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedOrders.map((order) => (
                            <tr key={order._id}>
                              <td>#{order._id.slice(-4)}</td>
                              <td>{order.customerId?.name || "Sin nombre"}</td>
                              <td>{order.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <br />
                      <h4>Total ventas: ${totalSales.toFixed(2)}</h4>
                    </div>
                  )
                ) : filteredOrders.length === 0 ? (
                  <p className="text-center position-absolute top-50 start-50 translate-middle">
                    No hay pedidos para esta tienda.
                  </p>
                ) : (
                  <div className="orders-grid">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order._id} order={order} updateOrder={updateOrder} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
