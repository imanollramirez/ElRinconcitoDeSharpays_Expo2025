import React, { createContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_URL } from "../config";

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        
        const storedUserId = await AsyncStorage.getItem("userId");

        if (token && token !== "undefined") setAuthToken(token);
        if (storedUserId && storedUserId !== "undefined") setUserId(storedUserId);
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };
    loadStoredData();
  }, []);

  const clearSession = async () => {
    await AsyncStorage.multiRemove(["token", "userId"]);
    setAuthToken(null);
    setUserId(null);
  };

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logOut`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      await clearSession();
      Alert.alert("Sesión cerrada correctamente");
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login/private`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
          setAuthToken(data.token);
        }

        if (data.userId && data.userId !== undefined) {
          await AsyncStorage.setItem("userId", String(data.userId));
          setUserId(data.userId);
        }

        //console.log("Datos recibidos del servidor:", data);
        Alert.alert("Inicio de sesión exitoso");
        return true;
      } else {
        Alert.alert(data.message || "Error al iniciar sesión");
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error con el servidor");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userId,
        loading,
        login,
        logout,
        API: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
