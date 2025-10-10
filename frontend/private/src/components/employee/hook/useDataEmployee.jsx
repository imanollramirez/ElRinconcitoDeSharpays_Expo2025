import { useState, useEffect } from "react";

const useDataEmployee = () => {
  const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/employees";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(API);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error al obtener los empleados", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesById = async (id) => {  
  setLoading(true);
  try {
    const response = await fetch(`${API}/${id}`);
    const data = await response.json();
    
    // Actualizar los estados
    setName(data.name);
    setEmail(data.email);
    setImageUrl(data.image);
  } catch (error) {
    console.error("Error al obtener los empleados", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Limpia todos los campos y regresa a la lista
  const resetForm = () => {
    setId("");
    setName("");
    setEmail("");
    setPassword("");
    setImageUrl("");
    setActiveTab("list");
  };

  const saveEmployee = async (employee) => {
    try {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      if (employee.password) formData.append("password", employee.password);
      if (employee.imageUrl && typeof employee.imageUrl !== "string") {
        formData.append("image", employee.imageUrl);
      }

      const response = await fetch(API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Error al insertar");
      }

      fetchEmployees(); // Actualiza la lista
      resetForm(); // Limpia el formulario después de editar
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = async (employee) => {
    try {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      if (employee.password) formData.append("password", employee.password);
      if (employee.imageUrl && typeof employee.imageUrl !== "string") {
        formData.append("image", employee.imageUrl);
      }

      const response = await fetch(`${API}/${employee.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Error al actualizar");
      }

      fetchEmployees(); // Actualiza la lista
      resetForm(); // Limpia el formulario después de editar
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar empleado");

      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Para editar: carga los datos en el formulario
  const updateEmployee = (employee) => {
    setId(employee._id);
    setName(employee.name);
    setEmail(employee.email);
    setPassword(""); // No mostrar contraseña por seguridad
    setImageUrl(employee.image || "");
    setActiveTab("form");
  };

  return {
    activeTab,
    setActiveTab,
    id,
    setId,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    imageUrl,
    setImageUrl,
    employees,
    loading,
    saveEmployee,
    deleteEmployee,
    updateEmployee,
    handleEdit,
    resetForm,
    fetchEmployeesById,
  };
};

export default useDataEmployee;
