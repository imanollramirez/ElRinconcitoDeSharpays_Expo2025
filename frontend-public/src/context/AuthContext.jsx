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
  
      if (!response.ok) {
        ErrorAlert(data.message);
        return { success: false, message: data.message };
      }
  
      setUser(data.user);
      setIsLoggedIn(true);
      SuccessAlert("Sesión iniciada con éxito.");
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
      } finally {
        setLoading(false);
      }
    };
  
    checkSession();
  }, [API_URL]);
  

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