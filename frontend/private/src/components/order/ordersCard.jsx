import React, { useState } from "react";
import CustomButton from "../CustomButton";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";

const OrderCard = ({ order, updateOrder }) => {
  const { orderDetails, total, customerId, _id, shippingAddress } = order;
  const [status, setStatus] = useState(order.status);

  const [previewImage, setPreviewImage] = useState(null);

  // Estado para modal de envío
  const [showShipping, setShowShipping] = useState(false);

  const markAsDelivered = async () => {
    try {
      const updatedStatus = "completado";
      setStatus(updatedStatus);
      await updateOrder(_id, { status: updatedStatus });
      SuccessAlert("Orden marcada como entregada");
    } catch (err) {
      console.error(err);
      ErrorAlert("No se pudo actualizar el estado de la orden");
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="avatar">{customerId.name?.slice(0, 2).toUpperCase()}</div>
        <div>
          <p className="customer-name">{customerId.name}</p>
          <p className="order-id">Orden #{_id.slice(-4)}</p>
        </div>
        <span className={`status-badge ${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Productos</th>
            <th>Cant.</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((item, i) => (
            <tr key={i}>
              <td>
                {item.productName}
                {item.customDesign && (
                  <button
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      background: "#f0f0f0",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                    onClick={() => setPreviewImage(item.customDesign)}
                  >
                    custom.jpg
                  </button>
                )}
              </td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-total">
        <strong>Total:</strong> ${total.toFixed(2)}
      </div>

      {/* Botón para ver detalles de envío */}
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={() => setShowShipping(!showShipping)}
          style={{
            background: "none",
            border: "none",
            color: "#1b1c1dff",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            fontSize: "14px"
          }}
        >
          Ver detalles de envío
        </button>
      </div>

      {/* Modal de envío */}
      {showShipping && shippingAddress && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShipping(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
              maxWidth: "90%"
            }}
          >
            <h3>Información de envío</h3>
            <p><strong>Dirección:</strong> {shippingAddress.address}</p>
            <p><strong>Ciudad:</strong> {shippingAddress.city}</p>
            <button
              onClick={() => setShowShipping(false)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="order-actions">
        <CustomButton
          text="Marcar como entregado"
          background="#000"
          color="#fff"
          onClick={markAsDelivered}
          disabled={status === "completado"}
        />
      </div>

      {/* Modal de imagen */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewImage(null);
          }}
        >
          <a
            href={previewImage}
            download={`orden-${_id}.jpg`}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#fff",
              borderRadius: "50%",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="black"
              viewBox="0 0 24 24"
            >
              <path d="M5 20h14v-2H5v2zm7-18v12l4-4h-3V4h-2v6H8l4 4z" />
            </svg>
          </a>

          <img
            src={previewImage}
            alt="Vista previa"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}
          />
        </div>
      )}
    </div>
  );
};


export default OrderCard;
