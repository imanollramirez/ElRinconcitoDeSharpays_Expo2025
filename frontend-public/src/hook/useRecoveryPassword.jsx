import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../components/SuccessAlert.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

const useRecoveryPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/recoveryPassword";

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


  const verifyCode = async (e) => {
    e.preventDefault();
    if (!code) { ErrorAlert("Ingrese el código"); return false};

    try {
      const res = await fetch(`${API}/verifyCode`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if(res.ok)
      {
        SuccessAlert("Se verificó el código");
        return true;
      }
      else
      {
        console.log(data.message)
        ErrorAlert("El código no es válido");
        return false;
      }
    
    } catch (err) {
      console.error(err);
      ErrorAlert("Error al verificar el código");
      return false;
    }
  };

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
        navigate("/login");
      } else {
        ErrorAlert(data.message || "Error");
      }
    } catch (err) {
      console.error(err);
      ErrorAlert("Error al establecer la nueva contraseña");
    }
  };

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

export default useRecoveryPassword;
