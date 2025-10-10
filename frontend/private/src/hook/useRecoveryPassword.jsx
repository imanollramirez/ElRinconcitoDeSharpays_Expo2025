import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../components/SuccessAlert.jsx"; // Componente de alerta para mostrar mensajes de éxito
import ErrorAlert from "../components/ErrorAlert.jsx"; // Componente de alerta para mostrar mensajes de error

const useRecoveryPassword = () => {
  const navigate = useNavigate(); // Hook de React Router para redirigir a otra página

  // Estados para manejar los valores del formulario de recuperación de contraseña
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // URL base de la API para recuperación de contraseñas
  const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/recoveryPassword";

  // Función para enviar el código de recuperación al correo
  const sendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      ErrorAlert("Ingrese el correo electrónico");
      return false;
    }

    try {
      const res = await fetch(`${API}/requestCode`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        SuccessAlert("Se envió el código");
        return true;
      } else {
        ErrorAlert(data.message || "Hubo un error");
        return false;
      }
    } catch (err) {
      console.error(err);
      ErrorAlert("Error al enviar el código");
      return false;
    }
  };

  // Función para verificar que el código ingresado sea válido
  const verifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      ErrorAlert("Ingrese el código");
      return false;
    }

    try {
      const res = await fetch(`${API}/verifyCode`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        SuccessAlert("Se verificó el código");
        return true;
      } else {
        console.log(data.message);
        ErrorAlert("El código no es válido");
        return false;
      }
    } catch (err) {
      console.error(err);
      ErrorAlert("Error al verificar el código");
      return false;
    }
  };

  // Función para restablecer la contraseña
  const resetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return ErrorAlert("Complete los campos");
    if (newPassword !== confirmPassword) return ErrorAlert("Las contraseñas no coinciden");

    try {
      const res = await fetch(`${API}/newPassword`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        SuccessAlert("Se restableció la contraseña");
        navigate("/login"); // Redirige al login una vez cambiada la contraseña
      } else {
        ErrorAlert(data.message || "Error");
      }
    } catch (err) {
      console.error(err);
      ErrorAlert("Error al establecer la nueva contraseña");
    }
  };

  // Retorna los estados y funciones para usarlos en los componentes
  return {
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    sendCode,
    verifyCode,
    resetPassword,
  };
};

export default useRecoveryPassword; // Exporta el hook personalizado
