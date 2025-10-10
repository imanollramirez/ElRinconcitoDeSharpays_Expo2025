import React, { createContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { API_URL } from "../config";

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

        // 🔐 Preguntar si desea activar login con biometría
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (compatible && enrolled) {
          Alert.alert(
            "Activar inicio con biometría",
            "¿Deseas activar el inicio con Face ID o huella para futuros ingresos?",
            [
              { text: "No", style: "cancel" },
              {
                text: "Sí",
                onPress: async () => {
                  await SecureStore.setItemAsync("biometricEnabled", "true");
                  await SecureStore.setItemAsync("bioToken", data.token);
                  await SecureStore.setItemAsync("bioUserId", String(data.userId));
                },
              },
            ]
          );
        }

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

  // 🔹 Nueva función para login biométrico con botón
  const biometricLogin = async () => {
    const storedToken = await SecureStore.getItemAsync("bioToken");
    const storedId = await SecureStore.getItemAsync("bioUserId");
    const biometricEnabled = await SecureStore.getItemAsync("biometricEnabled");

    if (!storedToken || !storedId || biometricEnabled !== "true") {
      Alert.alert("Primero inicia sesión con tu correo y contraseña para activar el acceso biométrico.");
      return false;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      Alert.alert("Tu dispositivo no tiene Face ID o huella configurada.");
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Inicia sesión con Face ID o huella",
    });

    if (result.success) {
      await AsyncStorage.setItem("token", storedToken);
      await AsyncStorage.setItem("userId", storedId);
      setAuthToken(storedToken);
      setUserId(storedId);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userId,
        loading,
        login,
        logout,
        biometricLogin,
        API: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
