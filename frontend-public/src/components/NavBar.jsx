import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./NavBar.css";
import img from "../assets/sharpaysLogo.png";
import ThemeSwitch from "./ThemeSwitch";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  return (
    <>
      <header className="menu-header">
        <div className="menu-left">
          <button className="hamburger" onClick={toggleMenu}>
            <FaBars />
          </button>
          <img src={img} alt="Logo" className="menu-logo" />
          <span className="menu-title">El Rinconcito de Sharpay</span>
        </div>

        <nav className="menu-nav">
          <Link to="/">Inicio</Link>
          <div className="dropdown">
            <button className="drop-btn">Tiendas</button>
            <div className="dropdown-content">
              <Link to="/sharpays">Sharpay's Boutique</Link>
              <Link to="/frostyBites">Frostibites</Link>
              <Link to="/bougies">Bougies</Link>
              <Link to="/paraiso">El Paraíso de Dios</Link>
              
            </div>
          </div>
          <Link to="/duas">DUAS</Link>
          
          <Link to="/elRinconcitoDeSharpays">Sobre Nosotros</Link>
        </nav>

        <div className="menu-right">
          <Link to="/carrito" className="menu-btn">
            <FaShoppingCart /> Carrito
          </Link>
          <Link to="/profile" className="menu-btn">
            Perfil <FaUserCircle />
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? "show" : ""}`}>
        <div className="mobile-nav-header">
          <img src={img} alt="Logo" className="mobile-logo" />
          <button className="close-btn" onClick={closeMenu}>
            <FaTimes />
          </button>
        </div>
        <div className="mobile-nav-content">
          <Link to="/" className="mobile-nav-item" onClick={closeMenu}>Inicio</Link>

          <div className="mobile-dropdown">
            <button className="mobile-nav-item dropdown-toggle" onClick={toggleDropdown}>
              Tiendas
            </button>
            <div className={`mobile-dropdown-content ${isDropdownOpen ? "show" : ""}`}>
              <Link to="/sharpays" className="mobile-nav-subitem" onClick={closeMenu}>Sharpay's Boutique</Link>
              <Link to="/frostyBites" className="mobile-nav-subitem" onClick={closeMenu}>Frostibites</Link>
              <Link to="/bougies" className="mobile-nav-subitem" onClick={closeMenu}>Bougies</Link>
              <Link to="/paraiso" className="mobile-nav-subitem" onClick={closeMenu}>El Paraíso de Dios</Link>
              <Link to="/duas" className="mobile-nav-subitem" onClick={closeMenu}>DUAS</Link>
            </div>
          </div>

          <Link to="/elRinconcitoDeSharpays" className="mobile-nav-item" onClick={closeMenu}>Sobre Nosotros</Link>

          <div className="mobile-actions">
            <Link to="/carrito" className="mobile-action-btn" onClick={closeMenu}>
              <FaShoppingCart /> Carrito
            </Link>
            <Link to="/profile" className="mobile-action-btn" onClick={closeMenu}>
              <FaUserCircle /> Perfil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
