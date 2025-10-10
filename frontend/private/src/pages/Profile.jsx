import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // Contexto de autenticación para obtener el usuario logueado

import "../styles/Profile.css"; // Estilos propios de la página de perfil

import useDataEmployee from "../components/employee/hook/useDataEmployee.jsx"; // Hook para manejar datos de empleados
import RegisterEmployee from "../components/employee/registerEmployee.jsx"; // Formulario de registro/edición de empleado

const Profile = () => {
    // Se obtiene el usuario desde el contexto de autenticación
    const { user } = useAuth();
    // Hook personalizado para manejar la lógica de empleados
    const data = useDataEmployee();

    // Al cargar el componente, si existe un usuario, se busca la información del empleado por su id
    useEffect(() => {
        if (user) {
            data.fetchEmployeesById(user?.id);
        }
    }, [user?.id]);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2"></div> {/* Columna vacía para margen */}
                    <div className="col-10">

                        {/* Contenedor principal del perfil */}
                        <div
                            className="mt-4 container-profile"
                            style={{
                                borderRadius: 25,
                                padding: '20px',
                                height: '95vh',
                                width: '90%',
                                boxShadow: '0 1px 8px 10px rgba(0, 0, 0, 0.1)'
                            }}>
                            
                            {/* Título de la página */}
                            <h1 className="fw-bold p-2">Perfil</h1>

                            {/* Formulario de edición del perfil del empleado */}
                            <RegisterEmployee
                                {...data} id={user?.id} fromProfile={true} />

                            {/* Animación decorativa en el perfil */}
                            <div className="gif-animation-profile" style={{
                                marginTop: '20px',
                                textAlign: 'center',
                                backgroundColor: '#fff'
                            }}>
                                <img
                                    src="https://cdn.dribbble.com/userupload/5509318/file/original-9fcb4efd061af4c6eb3c0b056bda48d1.gif"
                                    style={{ width: '40%', opacity: 0.9 }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile; 
