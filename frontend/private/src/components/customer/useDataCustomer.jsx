import { useState, useEffect } from "react";

const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/costumer";

const useDataCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener todos los clientes
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un cliente por su ID
  const fetchCustomerById = async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const res = await fetch(`${API}/${id}`);
      if (!res.ok) throw new Error("Cliente no encontrado");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching customer by id", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Llamar a la API cuando se monte el hook
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    fetchCustomers,
    fetchCustomerById,
  };
};

export default useDataCustomer;
