// hooks/useOrders.js
import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../config.js";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las órdenes
  const getOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar orden (puede ser status u otros campos)
  const updateOrder = useCallback(async (orderId, updatedFields) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const updatedOrder = await res.json();

      // Merge con estado local (similar a la web)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, ...updatedOrder } : order
        )
      );
    } catch (err) {
      console.error("Error al actualizar orden:", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return {
    orders,
    loading,
    error,
    getOrders,
    updateOrder,
  };
};

export default useOrders;
