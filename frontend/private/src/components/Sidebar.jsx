import React, { useState } from 'react';
import "../styles/Sidebar.css"
import { NavLink } from 'react-router-dom';
import {
FaHome,
FaUsers,
FaTags,
FaStore,
FaPaw,
FaLightbulb,
FaIceCream,
FaLeaf,
FaFileInvoice,
FaSignOutAlt,
FaBars,
FaBell,
FaUser
} from 'react-icons/fa';

    // Componente Sidebar que muestra un menú de navegación lateral
// Incluye enlaces a diferentes secciones de la aplicación y un botón para cerrar sesión

import { useAuth } from '../context/AuthContext';
import SuccessAlert from './SuccessAlert';


const Sidebar = () => {

const [isOpen, setIsOpen] = useState(false);
const toggleSidebar = () => setIsOpen(!isOpen);
const { logout } = useAuth();

return (
<>
<button className="hamburger" onClick={toggleSidebar}>
<FaBars />
</button>

<aside className={`sidebar ${isOpen ? 'show' : ''}`}>
<div className="logo"></div>

<nav>
<NavLink to="/Dashboard" className="nav-item" onClick={toggleSidebar}>
<FaHome /> <span>Home</span>
</NavLink>

<NavLink to="/profile" className="nav-item nav-profile" onClick={toggleSidebar}>
<FaUser /> <span>Perfil</span>
</NavLink>

<div className="section-title">CONFIGURACIONES</div>
<NavLink to="/employee" className="nav-item" onClick={toggleSidebar}>
<FaUsers /> <span>Empleados</span>
</NavLink>
<NavLink to="/category" className="nav-item" onClick={toggleSidebar}>
<FaStore /> <span>Administración de Tiendas</span>
</NavLink>

<div className="section-title">TIENDAS</div>
<NavLink to="/sharpays" className="nav-item" onClick={toggleSidebar}>
<FaPaw /> <span>Sharpay’s Boutique</span>
</NavLink>
<NavLink to="/bougies" className="nav-item" onClick={toggleSidebar}>
<FaLightbulb /> <span>Bougies</span>
</NavLink>
<NavLink to="/frostybites" className="nav-item" onClick={toggleSidebar}>
<FaIceCream /> <span>FrostyBites</span>
</NavLink>
<NavLink to="/paradise" className="nav-item" onClick={toggleSidebar}>
<FaLeaf /> <span>El paraíso de Dios</span>
</NavLink>

<div className="section-title"></div>
<NavLink to="/events" className="nav-item" onClick={toggleSidebar}>
<FaBell /> <span>Eventos</span>
</NavLink>

<NavLink to="/orders" className="nav-item" onClick={toggleSidebar}>
<FaFileInvoice /> <span>Pedidos</span>
</NavLink>
</nav>

<button className="logout-button" onClick={(e) => {e.preventDefault(); logout(); SuccessAlert("Sesión cerrada con éxito")}}>
<FaSignOutAlt /> <span>Cerrar Sesión</span>
</button>
</aside>
</>
);
};

export default Sidebar;