import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const MiniWhatsApp = () => {
  const [open, setOpen] = useState(false);

  const phone = "1234567890";
  const message = "Hola! Quiero más información.";

  return (
    <>
      {/* Botón para abrir/cerrar chat */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "30px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <FaWhatsapp />
      </button>

      {/* Ventana mini chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <iframe
            title="WhatsApp"
            src={`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
              message
            )}`}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      )}
    </>
  );
};

export default MiniWhatsApp;
