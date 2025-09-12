import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ErrorAlert from "../../src/components/ErrorAlert";

// Creamos el contexto
const AuthContext = createContext(null);

// Exportamos el contexto para que pueda ser importado por useAuth.js
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authCookie, setauthCookie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api";

  const navigate = useNavigate();

  // Función para limpiar sesión - función interna que no causa dependencias cíclicas
  const clearSession = () => {
    localStorage.removeItem("token");
    Cookies.remove("authToken", { path: "/" });
    setUser(null);
    setauthCookie(null);
    setIsLoggedIn(false);
  };

  // Definir la función logout como useCallback para evitar recreaciones
  const logout = useCallback(() => {
    const logoutUser = async () => {
      try {
        await fetch(`${API_URL}/logOut`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        clearSession();
        navigate("/login");
      }
    };

    logoutUser();
  }, [API_URL, navigate]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login/private`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setauthCookie(data.token);
        setUser(data.user);
        setIsLoggedIn(true);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const cookieToken = Cookies.get("authToken");

        if (token || cookieToken) {
          const response = await fetch(`${API_URL}/Products`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || cookieToken}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            try {
              const tokenParts = (token || cookieToken).split(".");
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                setUser({
                  id: payload.id,
                  userType: payload.userType,
                  name: payload.name,
                  image: payload.image,
                  email: payload.email,
                });
                setauthCookie(token || cookieToken);
                setIsLoggedIn(true);
              }
            } catch (e) {
              console.error("Error decoding token:", e);
              clearSession();
            }
          } else {
            clearSession();
          }
        } else {
          clearSession();
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        clearSession();
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authCookie,
        login,
        logout,
        isLoggedIn,
        API: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
