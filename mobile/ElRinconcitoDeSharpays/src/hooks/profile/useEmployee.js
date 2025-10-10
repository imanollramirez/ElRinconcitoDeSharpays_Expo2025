import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Alert } from "react-native";
import { API_URL } from "../../config"; 

export const useEmployee = () => {
  const { userId, authToken } = useContext(AuthContext); // 👈 Quitamos API
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEmployee = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/employees/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener empleado");
      }

      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, authToken]);

  const updateEmployee = useCallback(
    async (employeeData) => {
      if (!userId) return false;

      setLoading(true);
      try {
        let body;
        let headers;

        // Si la imagen es local, usa FormData
        if (employeeData.image && employeeData.image.startsWith('file://')) {
          body = new FormData();
          body.append('name', employeeData.name);
          body.append('email', employeeData.email);
          body.append('image', {
            uri: employeeData.image,
            name: 'profile.jpg',
            type: 'image/jpeg',
          });
          headers = {
            Authorization: `Bearer ${authToken}`,
            // No pongas Content-Type, React Native lo pone automáticamente para FormData
          };
        } else {
          // Si no hay imagen nueva, manda JSON normal
          body = JSON.stringify(employeeData);
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          };
        }

        const response = await fetch(`${API_URL}/employees/${userId}`, {
          method: "PUT",
          headers,
          body,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al actualizar empleado");
        }

        setEmployee(data);
        Alert.alert('Perfil actualizado', 'Tus cambios han sido guardados.');
        return true;
      } catch (error) {
        console.error("Error updating employee:", error);
        Alert.alert("Error", error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, authToken]
  );

  useEffect(() => {
    getEmployee();
  }, [getEmployee]);

  return { employee, loading, getEmployee, updateEmployee };
};
