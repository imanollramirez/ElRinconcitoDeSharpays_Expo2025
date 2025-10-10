import { useState, useEffect } from "react";
import ErrorAlert from "../../ErrorAlert"; // Componente de alerta para mostrar errores
import SuccessAlert from "../../SuccessAlert"; // Componente de alerta para mostrar mensajes de éxito

// Endpoints de la API
const API_ORDERS = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/orders"; // API de pedidos
const API_CATEGORIES = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/categories"; // API de categorías

// Hook personalizado para manejar pedidos con sus categorías
const useOrdersWithCategories = () => {
  // Estado para guardar la lista de pedidos
  const [orders, setOrders] = useState([]);
  // Estado para guardar la lista de categorías
  const [categories, setCategories] = useState([]);
  // Estado para indicar si se está cargando información
  const [loading, setLoading] = useState(false);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Función para obtener pedidos y categorías desde la API
  const fetchAll = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      // Se hacen las dos peticiones en paralelo
      const [resOrders, resCat] = await Promise.all([
        fetch(API_ORDERS),
        fetch(API_CATEGORIES),
      ]);

      // Se obtienen los datos en formato JSON
      const [ordersData, categoriesData] = await Promise.all([
        resOrders.json(),
        resCat.json(),
      ]);

      // Se actualizan los estados con los datos recibidos
      setOrders(ordersData);
      setCategories(categoriesData);
      setError(null); // Se limpia cualquier error previo
    } catch (err) {
      // Manejo de error si alguna petición falla
      setError(err.message);
      ErrorAlert("Error cargando pedidos o categorías");
    } finally {
      setLoading(false); // Se termina el estado de carga
    }
  };

  // Función para actualizar una orden específica
  const updateOrder = async (orderId, updatedFields) => {
    try {
      // Petición PUT para actualizar la orden en el backend
      const res = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      // Se obtiene la orden actualizada desde la API
      const updatedOrder = await res.json();

      // Se actualiza el estado de órdenes reemplazando la orden modificada
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, ...updatedOrder } : order
        )
      );

      SuccessAlert("Orden actualizada");
    } catch (err) {
      // Si falla la actualización se captura el error
      setError(err.message);
      ErrorAlert("Error al actualizar orden");
    }
  };

  // Se ejecuta al montar el componente para cargar los datos
  useEffect(() => {
    fetchAll();
  }, []);

  // Se retorna todo lo necesario para usar el hook en otros componentes
  return { orders, categories, loading, error, refresh: fetchAll, updateOrder };
};

export default useOrdersWithCategories;
