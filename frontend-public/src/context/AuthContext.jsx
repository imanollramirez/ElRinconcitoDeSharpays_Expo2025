import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert"

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api";
  const navigate = useNavigate();

  const clearSession = () => {
    // Limpiar tanto localStorage como cookies
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("userId", { path: "/" });
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
      } else if (!response.ok) {
        return { success: false, message: data.message };
      }

      // Caso: login exitoso - GUARDAR TOKEN Y USER ID
      if (data.token) {
        localStorage.setItem("token", data.token);
        Cookies.set("authToken", data.token, { path: "/" });
      }

      setUser({
        id: data.userId,
        name: data.name,
        email: data.email,
        userType: data.userType,
        image: data.image,
      });
      SuccessAlert("Sesión iniciada con éxito.")
      setIsLoggedIn(true);
      setLoading(false);

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
        // Primero revisar si hay token en localStorage o cookies
        const token = localStorage.getItem("token") || Cookies.get("authToken");
        const savedUserId = localStorage.getItem("userId") || Cookies.get("userId");
        
        if (token && savedUserId) {
          // Si hay token y userId guardados, decodificar token para obtener info completa
          try {
            const tokenParts = token.split(".");
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              setUser({
                id: payload.id || savedUserId, // usar savedUserId como fallback
                userType: payload.userType,
                name: payload.name,
                image: payload.image,
                email: payload.email,
              });
              setIsLoggedIn(true);
            }
          } catch (e) {
            console.error("Error decoding token:", e);
            // Si falla la decodificación pero tenemos userId, crear user básico
            if (savedUserId) {
              setUser({ id: savedUserId });
              setIsLoggedIn(true);
            } else {
              clearSession();
            }
          }
        } else if (savedUserId) {
          // Si solo tenemos userId guardado, crear user básico
          setUser({ id: savedUserId });
          setIsLoggedIn(true);
        }
        
        // También verificar con el servidor
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.id) {
            // Guardar también en storage cuando viene del servidor
            localStorage.setItem("userId", data.user.id);
            Cookies.set("userId", data.user.id, { path: "/" });
          }
          setUser(data.user);
          setIsLoggedIn(true);
        } else if (!token && !savedUserId) {
          clearSession();
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        if (!localStorage.getItem("token") && !Cookies.get("authToken")) {
          clearSession();
        }
      } finally {
        setLoading(false); 
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, loading, API: API_URL, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};