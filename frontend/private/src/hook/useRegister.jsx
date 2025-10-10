import SuccessAlert from "../components/SuccessAlert.jsx"; // Alerta para mostrar mensajes de éxito
import ErrorAlert from "../components/ErrorAlert.jsx"; // Alerta para mostrar mensajes de error

// Endpoint de la API para registrar empleados
const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/registerEmployee";

// Función asíncrona que registra un nuevo empleado
export const registerEmployee = async ({ name, email, password }) => {
  try {
    // Petición POST al backend con los datos del empleado
    const res = await fetch(API, {
      method: "POST",
      credentials: "include", // Incluye cookies si son necesarias para la sesión
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    // Se obtiene la respuesta en formato JSON
    const data = await res.json();

    // Si la respuesta fue exitosa
    if (res.ok) {
      SuccessAlert(data.message || "Registro éxitoso");
      return true; // Retorna true para indicar que se registró correctamente
    } else {
      // Si hubo un error en la respuesta del servidor
      ErrorAlert(data.message || "Error al registrar");
      return false;
    }
  } catch (err) {
    // Si ocurre un error inesperado en la petición
    console.error("Error al registrar empleado:", err);
    ErrorAlert("Error del servidor");
    return false;
  }
};
