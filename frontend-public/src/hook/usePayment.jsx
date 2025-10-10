import { useState } from "react";
import ErrorAlert from "../components/ErrorAlert";

const usePaymentFakeForm = () => {
  const [formData, setFormData] = useState({
  monto: "",
  firstName: "",
  phone: "",
  email: "",
  municipality: "",
  houseNumber: "",
  tokenTarjeta: null,
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cleanForm = () => {
    setFormData({
      firstName: "",
      phone: "",
      email: "",
      municipality: "",
      houseNumber: "",
      monto: "",
    });
  };

 const handleFakePayment = async () => {
    try {
      console.log("Generando token de acceso...");
      
      const tokenResponse = await fetch("https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/payment/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Error al obtener token: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log("Token generado. Enviando pago...", accessToken);

      const formDataPayment = {
        monto: formData.monto,
        nombreCliente: formData.firstName,
        emailCliente: formData.email,
        tokenTarjeta: "null", // Simulando que no se envía el token de tarjeta
      };

      // 2. Enviar datos de pago al backend, que se encargará de llamar a Wompi
      const paymentResponse = await fetch(
        "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/payment/paymentProcess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken,
            formData: formDataPayment,
          }),
        }
      );

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        throw new Error(`Error al procesar pago: ${errorText}`);
      }

      const paymentData = await paymentResponse.json();
      console.log("Respuesta del pago:", paymentData);

    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      ErrorAlert(`Error: ${error.message}`);
    }

    cleanForm();
  };

  return {
    formData,
    handleChange,
    cleanForm,
    handleFakePayment,
  };
};
export default usePaymentFakeForm;