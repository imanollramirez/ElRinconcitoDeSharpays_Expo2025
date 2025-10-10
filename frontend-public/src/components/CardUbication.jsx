import { useState, useEffect, useContext } from "react";
import "../styles/CardUbication.css";
import { AuthContext } from "../context/AuthContext";
import useDataCustomer from "./customer/hook/useDataCustomer";
import Departments from "../utils/apiDepartmentsSV"; // API para obtener los departamentos

export default function CardUbication() {
  const { user } = useContext(AuthContext); // Obtener usuario desde el contexto
  const [department, setDepartment] = useState("Sin ubicación");
  const [newDepartment, setNewDepartment] = useState(""); // Para cambiar el departamento
  const [isEditable, setIsEditable] = useState(false); // Para permitir la edición
  const data = useDataCustomer();
  const depa = Departments(); // Lista de departamentos de la API

  // Función para obtener el nombre del departamento por su código
  const getDepartmentNameByCode = (code) => {
    const dep = depa.find((department) => department.value === code);
    return dep ? dep.label : "Sin ubicación";
  };

  // Obtener los datos del cliente cuando el usuario está logueado
  useEffect(() => {
    if (user?.id) {
      data.fetchCustomerById(user?.id);
    }
  }, [user?.id]);

  // Actualizar el departamento cuando la data cambia
  useEffect(() => {
    if (data.department) {
      // Obtener el nombre del departamento desde la lista de departamentos
      const departmentName = getDepartmentNameByCode(data.department);
      setDepartment(departmentName);  // Guardar el nombre del departamento
      setNewDepartment(data.department); // Guardar el código para actualizaciones
    }
  }, [data.department]);

  // Función para actualizar el departamento en el backend
  const handleUpdateDepartment = async () => {
    if (!newDepartment || newDepartment === "") {
      alert("Por favor selecciona un departamento.");
      return;
    }

    try {
      // Llamar a la API para actualizar el departamento
      const success = await data.updateCustomerDepartment(user.id, newDepartment);
      if (success) {
        const departmentName = getDepartmentNameByCode(newDepartment); // Mapear el nombre
        setDepartment(departmentName); // Actualizamos el nombre del departamento localmente
        setIsEditable(false); // Deshabilitamos la edición
      } else {
        alert("Ocurrió un error al actualizar la ubicación");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Error al actualizar la ubicación");
    }
  };

  // Función para activar/desactivar el modo de edición
  const toggleEdit = () => {
    if (isEditable) {
      handleUpdateDepartment(); // Si está en modo edición, guardar el cambio
    } else {
      setNewDepartment(department); // Inicializamos con el valor actual del departamento
      setIsEditable(true); // Activar modo edición
    }
  };

  return (
    <div className="card-ubication mt-5">
      <label className="card-ubication__label">Ubicación</label>
      
      <div className="card-ubication__input-container">
        {isEditable ? (
          // Si está en modo edición, mostrar el select para cambiar el departamento
          <select
            className="card-ubication__input"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)} // Cambiar departamento
          >
            <option value="">Selecciona un departamento</option>
            {depa && depa.map((dep) => (
              <option key={dep.value} value={dep.value}>
                {dep.label} {/* Mostrar el nombre del departamento */}
              </option>
            ))}
          </select>
        ) : (
          // Mostrar solo el departamento si no está en modo edición
          <input
            className="card-ubication__input"
            type="text"
            value={department}
            placeholder="Sin ubicación"
            disabled
          />
        )}
      </div>

      <div className="card-ubication__button-container">
        <button 
          className="card-ubication__button"
          onClick={toggleEdit}
        >
          {isEditable ? "Guardar" : "Editar"}
        </button>
      </div>
    </div>
  );
}
