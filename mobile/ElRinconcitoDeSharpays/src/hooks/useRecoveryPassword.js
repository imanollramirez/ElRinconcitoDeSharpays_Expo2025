import { useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

const API = `${API_URL}/recoveryPassword`;

const useRecoveryPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async () => {
      const savedEmail = await AsyncStorage.getItem("recovery_email");
      if (savedEmail) setEmail(savedEmail);
    })();
  }, []);

  const sendCode = async () => {
    if (!email) return alert("Ingrese el correo electrónico");

    try {
      const res = await fetch(`${API}/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem("recovery_email", email);
        if (data.token) await AsyncStorage.setItem("recovery_token", data.token);
        alert("Se envió el código");
        return true;
      }
      alert(data.message || "Hubo un error");
      return false;
    } catch (err) {
      console.error(err);
      alert("Error al enviar el código");
      return false;
    }
  };

  const verifyCode = async () => {
    if (!code) return alert("Ingrese el código");

    try {
      const token = await AsyncStorage.getItem("recovery_token");
      const res = await fetch(`${API}/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.token) await AsyncStorage.setItem("recovery_token", data.token);
        alert("Se verificó el código");
        return true;
      }
      alert(data.message || "El código no es válido");
      return false;
    } catch (err) {
      console.error(err);
      alert("Error al verificar el código");
      return false;
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) return alert("Complete los campos");
    if (newPassword !== confirmPassword) return alert("Las contraseñas no coinciden");

    try {
      const token = await AsyncStorage.getItem("recovery_token");
      const res = await fetch(`${API}/newPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Se restableció la contraseña");
        await AsyncStorage.multiRemove(["recovery_email", "recovery_token"]);
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        return true;
      } else {
        alert(data.message || "Error");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Error al establecer la nueva contraseña");
      return false;
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
