import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CircularGallery from "../components/reactBits/CircularGallery.jsx";
import SuccessAlert from "../components/SuccessAlert.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import "../styles/CheckOut.css";
import useDataCustomer from "../components/customer/hook/useDataCustomer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import PaymentMethod from "../components/PaymentMethods.jsx";
import useDataShoppingCart from "../components/shoppingCart/hooks/useDataShoppingCart.jsx";

import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
//Animation for showing or hidding content
import { motion, AnimatePresence } from "framer-motion";

import usePayment from "../hook/usePayment.jsx";

import Departments from "../utils/apiDepartmentsSV"; // API para obtener los departamentos

const CheckoutPage = () => {

  const depa = Departments();

  const {
    cartItems,
    total,
    createOrderFromCart,
    clearCart,
    moveCartToOrderDetail,
  } = useDataShoppingCart();

  const subtotal = total;
  const delivery = 3.49;
  const finalTotal = subtotal + delivery;

  const { user, isLoggedIn } = useAuth();
  const customerId = user?._id || user?.id;

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleCreateOrder = (paymentMethod) => {
    if (!isLoggedIn) {
      ErrorAlert("Debes iniciar sesión para crear una orden");
      return;
    }

    if (cartItems.length === 0) return;

    const orderDetail = {
      items: cartItems,
      total,
      paymentMethod,
      customerId,
    };

    localStorage.setItem("OrderDetail", JSON.stringify(orderDetail));
    navigate("/checkOut");
  };

  const navigate = useNavigate();

  const data = useDataCustomer();

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (base64Image) => {
    if (!base64Image) return null;

    try {
      const formData = new FormData();
      formData.append("file", base64Image);
      formData.append("upload_preset", "preset_camisetas"); // Tu preset real

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dqmol5thk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        console.error("Cloudinary upload failed:", data);
        return null;
      }

      return data.secure_url;
    } catch (err) {
      console.error("Error subiendo imagen a Cloudinary:", err);
      return null;
    }
  };

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt) => {
    let { name, value } = evt.target;

    if (name === "number") {
      // Remove all non-digits
      value = value.replace(/\D/g, "");
      // Limit to 16 digits
      value = value.substring(0, 16);
      // Add space every 4 digits
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "expiry") {
      // Remove non-digits
      value = value.replace(/\D/g, "");
      // Limit to 4 digits (MMYY)
      value = value.substring(0, 4);
      // Add slash after 2 digits
      if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
    }

    setState((prev) => ({ ...prev, [name]: value }));
  };


  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  //Credit card payment process
  const {
    formData,
    handleChange,
    cleanForm,
    handleFakePayment,
  } = usePayment();

  useEffect(() => {
    const stored = localStorage.getItem("OrderDetail");

    if (!stored) {
      ErrorAlert("No hay ninguna orden activa");
      setTimeout(() => navigate("/"), 3000);
    } else {
      setOrderDetail(JSON.parse(stored));
    }

    if (user?.id) {
      data.fetchCustomerById(user?.id);
    }


  }, [user?.id]);
  
  useEffect(() => {
  if (data) {

    if (!formData.firstName) {
      handleChange({ target: { name: "firstName", value: data.name } });
    }
    if (!formData.email) {
      handleChange({ target: { name: "email", value: data.email } });
    }
    if (!formData.municipality) {
      handleChange({ target: { name: "municipality", value: data.department } });
    }
  }
}, [data]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderDetail) return;

    if (state.expiry) {
      const parts = state.expiry.split("/");
      const monthNum = parseInt(parts[0], 10);
      const yearNum = parseInt(parts[1], 10);
      const today = new Date();
      const currentYear = today.getFullYear() % 100;
      const currentMonth = today.getMonth() + 1;

      if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return ErrorAlert("La fecha de vencimiento no es válida");
      }
    }
    const shippingAddress = {
      address: formData.houseNumber,
      city: data?.department || (formData.municipality)
    };

    try {
      setLoading(true);

      // Subir diseños personalizados y generar productos finales
      // Dentro de handleSubmit, en la parte donde recorres orderDetail.items:
      const productsWithUrls = await Promise.all(
        orderDetail.items.map(async (item) => {
          let finalImage = item.product.image;
          let customDesign = item.product.customDesign || null;

          // 🔹 1. Subir customDesign si es base64
          if (customDesign && customDesign.startsWith("data:image")) {
            const uploadedUrl = await uploadToCloudinary(customDesign);
            if (uploadedUrl) {
              finalImage = uploadedUrl;
              customDesign = uploadedUrl;
            }
          }

          // 🔹 2. Subir imágenes del DUA si existen
          let duaData = item.product.duaData || null;
          if (duaData) {
            // Subir carnetImage
            if (
              duaData.carnetImage &&
              duaData.carnetImage.startsWith("data:image")
            ) {
              const carnetUrl = await uploadToCloudinary(duaData.carnetImage);
              if (carnetUrl) duaData.carnetImage = carnetUrl;
            }
            // Subir fotoImage
            if (
              duaData.fotoImage &&
              duaData.fotoImage.startsWith("data:image")
            ) {
              const fotoUrl = await uploadToCloudinary(duaData.fotoImage);
              if (fotoUrl) duaData.fotoImage = fotoUrl;
            }
          }

          return {
            productId: item.product._id?.startsWith("custom-")
              ? null
              : item.product._id,
            categoryId: item.product.categoryId?._id || null,
            productName: item.product.name,
            unitPrice: item.product.price,
            image: finalImage || null,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity,
            customDesign,
            duaData, // 🔹 Enviamos el DUA actualizado con URLs
          };
        })
      );

      const payload = {
        customerId: orderDetail.customerId,
        products: productsWithUrls,
        shippingAddress,
        status: "pendiente",
      };

      console.log("Payload final a enviar:", payload);

      const createOrder = async () => {
        const res = await fetch(
          "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/createOrderFromCart/create-from-cart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Backend error:", errorData);
          throw new Error(errorData.message || "Error al crear la orden");
        }
        navigate("/inicio");
        localStorage.removeItem("OrderDetail");
        localStorage.removeItem("shoppingCart");
      };


      if (paymentMethod === 'cash') {
        createOrder();
        SuccessAlert("Su pedido se creó con éxito");
      }
      else if (handleFakePayment) {
        formData.monto = parseFloat(finalTotal);
        await handleFakePayment();
        SuccessAlert("Su pago se realizo con éxito, su pedido está en curso.");
        createOrder();
      }


    } catch (err) {
      console.error("Error al procesar la orden:", err);
      ErrorAlert(err.message || "Error al procesar la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shopping-cart-page">
      <div className="carousel-wrapper">
        <CircularGallery />
      </div>

      <div className="cart-content">
        <h2 className="cart-title-main">Proceso de Pago</h2>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="form-section">
              <h2 className="section-title">
                <FaMapMarkerAlt size={20} />
                Dirección de la compra
              </h2>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group full-width">
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nombre"
                      value={formData?.firstName || data?.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group"></div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo Electrónico"
                      value={formData?.email || data?.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <select
                    className="form-input"
                    name="municipality"
                    value={formData?.municipality || data?.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    {depa && depa.map((dep) => (
                      <option key={dep.value} value={dep.value}>
                        {dep.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <input
                    type="text"
                    name="houseNumber"
                    placeholder="Número de casa, Apt #"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>


                {/* Credit card information */}

                <AnimatePresence>
                  {paymentMethod === 'card' &&
                    (
                      <>
                        <motion.div
                          key="card-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >

                          <h2 className="section-title">
                            <FaCreditCard size={20} />
                            Datos de la tarjeta
                          </h2>

                          <div className="card-model">
                            <Cards
                              number={state.number}
                              expiry={state.expiry}
                              cvc={state.cvc}
                              name={state.name}
                              focused={state.focus}
                              locale={{ valid: 'Válido hasta' }}
                              placeholders={{ name: 'Nombre' }}
                            />
                          </div>
                          <div className="checkout-form">
                            <div className="form-row pt-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="name"
                                  placeholder="Nombre del titular"
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                  className="form-input"
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <input
                                  type="text"
                                  name="number"
                                  placeholder="Número de la tarjeta"
                                  maxLength={19}
                                  value={state.number}
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                  className="form-input"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="expiry"
                                  placeholder="Fecha de vencimiento (Mes/Año)"
                                  maxLength={5}
                                  value={state.expiry}
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                  className="form-input"
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <input
                                  type="text"
                                  name="cvc"
                                  placeholder="CVC"
                                  maxLength={3}
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                  className="form-input"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )
                  }
                </AnimatePresence>

                <button
                  type="submit"
                  className="purchase-button"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Finalizar compra"}
                </button>
              </form>
            </div>
          </div>

          <div className="payment-section">
            <PaymentMethod
              subtotal={subtotal}
              total={finalTotal}
              onCreateOrder={handleCreateOrder}
              loading={loading}
              selectedPayment={paymentMethod}
              onPaymentChange={setPaymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
