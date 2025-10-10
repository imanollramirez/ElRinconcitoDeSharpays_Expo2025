import {config} from  "../config.js"

const payment = {};

payment.Token = async (req, res) => {
  try {
    const response = await fetch("https://id.wompi.sv/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: config.wompi.grant_type,
        client_id: config.wompi.client_id,
        client_secret: config.wompi.client_secret,
        audience: config.wompi.audience,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener token" });
  }
};

payment.PaymentProcess = async(req,res) => {
  try {
    const { token, formData } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token de acceso requerido" });
    }
    if (!formData) {
      return res.status(400).json({ error: "Datos de pago requeridos" });
    }

    const paymentResponse = await fetch(
      "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      return res.status(paymentResponse.status).json({ error });
    }

    const paymentData = await paymentResponse.json();
    res.json(paymentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

export default payment;