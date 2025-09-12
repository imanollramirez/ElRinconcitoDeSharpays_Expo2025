import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useDataCustomer from "../components/customer/hook/useDataCustomer";
import ErrorAlert from "../components/ErrorAlert";

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api";
  const { resendVerificationCode } = useDataCustomer();
  const navigate = useNavigate();

  const clearSession = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearSession();
      navigate("/elRinconcitoDeSharpays");
    }
  }, [API_URL, navigate]);

  const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    // Caso: la cuenta existe pero no está verificada
    if (response.status === 403 && data.requiresVerification) {
      ErrorAlert("Debe verificar su cuenta. Revise su correo.");
      navigate("/verifyAccount");
      return { success: false, message: "Verificación requerida" };
    }

    // Caso: cualquier otro error
    if (!response.ok) {
      return { success: false, message: data.message };
    }

    // Caso: login exitoso
    setUser({
      id: data.userId,
      name: data.name,
      email: data.email,
      userType: data.userType,
      image: data.image,
    });
    setIsLoggedIn(true);

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error durante login:", error);
    return { success: false, message: "Error de conexión" };
  }
};

  // Revisar sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          clearSession();
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        clearSession();
      }
    };

    checkSession();
  }, [API_URL]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, API: API_URL, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
