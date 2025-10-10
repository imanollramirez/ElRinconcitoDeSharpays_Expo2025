import React, { useState } from "react";
import visaLogo from "../assets/visaLogo.png";
import bacLogo from "../assets/bacLogo.png";

import agricolaLogo from "../assets/agricolaLogo.png";
import cash from "../assets/cash.png";

const PaymentMethod = ({
  subtotal,
  total,
  onCreateOrder,
  loading,
  selectedPayment,
  onPaymentChange
}) => {

  const handlePaymentChange = (method) => {
    onPaymentChange(method);
  };

  const handlePurchase = () => {
    onCreateOrder(selectedPayment);
  };

  return (
    <div className="payment-method-container">
      <div className="payment-summary">
        <div className="summary-row">
          <span>SubTotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Envío/Entrega</span>
          <span style={{ color: "#e65c95ff" }}>$3.39</span>
        </div>

        <div className="summary-row">
          <span>Estimado Total</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Método de Pago</h3>

        <div className="payment-options">
          <div
            className={`payment-option ${
              selectedPayment === "cash" ? "selected" : ""
            }`}
            onClick={() => handlePaymentChange("cash")}
          >
            <div className="payment-radio">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={selectedPayment === "cash"}
                onChange={() => handlePaymentChange("cash")}
              />
            </div>
            <div className="payment-info">
              <span className="payment-name">Efectivo</span>
              <div className="cash-logo">
                <img src={cash} width={60} alt="Efectivo" />
              </div>
            </div>
          </div>

          <div
            className={`payment-option ${
              selectedPayment === "card" ? "selected" : ""
            }`}
            onClick={() => handlePaymentChange("card")}
          >
            <div className="payment-radio">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={selectedPayment === "card"}
                onChange={() => handlePaymentChange("card")}
              />
            </div>
            <div className="payment-info">
              <span className="payment-name">Tarjeta de Crédito/Débito</span>
              <div className="payment-logos">
                <img src={visaLogo} alt="Visa" className="payment-logo" />
                <img
                  src={agricolaLogo}
                  alt="MasterCard"
                  className="payment-logo"
                />
                <img
                  src={bacLogo}
                  alt="American Express"
                  className="payment-logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="security-info">
        <div className="security-badges">
          <span className="security-badge">Pago Seguro</span>
          <span className="security-badge">SSL Encriptado</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;