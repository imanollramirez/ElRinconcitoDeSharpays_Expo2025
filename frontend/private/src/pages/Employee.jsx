import React from "react";
import EmployeeForm from "../components/employee/registerEmployee.jsx";
import EmpsTable from "../components/employee/employeeTable.jsx";
import useDataEmployee from "../components/employee/hook/useDataEmployee.jsx";

import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import QuestionAlert from "../components/QuestionAlert.jsx";

import Swal from "sweetalert2";
import "../styles/Employee.css";

const EmployeePage = () => {
  const data = useDataEmployee();

  // Función para manejar creación y edición usando los métodos del hook
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email) {
      ErrorAlert("Por favor, completa todos los campos requeridos");
      return;
    }

    try {
      if (data.id) {
        // Edición
        await data.handleEdit({
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password,
          imageUrl: data.imageUrl,
        });
        SuccessAlert("Empleado actualizado exitosamente");
      } else {
        // Creación
        await data.saveEmployee({
          name: data.name,
          email: data.email,
          password: data.password,
          imageUrl: data.imageUrl,
        });
        SuccessAlert("Empleado creado exitosamente");
      }
      data.resetForm();
      data.setActiveTab("list");
    } catch (err) {
      // Como el hook usa alert(), aquí también capturamos errores si llegasen
      ErrorAlert("Error: " + err.message || err);
    }
  };

  // Función para manejar eliminación con confirmación
  const handleDelete = async (id) => {
    const result = await QuestionAlert("¿Estás seguro de eliminar este empleado?");
    if (result.isConfirmed) {
      try {
        await data.deleteEmployee(id);
        SuccessAlert("Empleado eliminado exitosamente");
      } catch (err) {
        ErrorAlert("Error al eliminar empleado: " + err.message || err);
      }
    }
  };

  // Función para cargar datos en formulario para editar
  const handleEdit = (employee) => {
    data.updateEmployee(employee);
    data.setActiveTab("form");
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10">
            <div className="users-main-container">
              <h1 className="main-title">Usuarios</h1>

              <div className="form-and-fields">
                <EmployeeForm
                  {...data}
                  resetForm={data.resetForm}
                  handleSubmit={handleSubmit}
                />
              </div>

              <div className="users-table-wrapper">
              <EmpsTable
  employees={data.employees}
  loading={data.loading}
  updateEmployee={handleEdit}   // <-- Cambiado a updateEmployee
  deleteEmployee={handleDelete} // <-- Cambiado a deleteEmployee
/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeePage;
