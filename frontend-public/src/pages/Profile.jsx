import React from "react";
import { useNavigate } from "react-router-dom";  // Importa el hook useNavigate para redirigir
import CardOrders from "../components/CardOrders.jsx";
import CardPersonalInformation from "../components/CardPersonalInformation.jsx";
import CardUbication from "../components/CardUbication.jsx";
import CardImage from "../components/CardImageProfile.jsx";
import useDataShoppingCart from "../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import "../styles/Profile.css";

const Profile = () => {
  const { cartItems } = useDataShoppingCart();
  const navigate = useNavigate();  // Inicializa el hook useNavigate

  // Función para redirigir al usuario a la página de pedidos
  const goToOrders = () => {
    navigate("/orders");  // Redirige a la ruta /orders
  };

  return (
    <div className="profile-container">
      <main>
        {/* Los componentes se ordenarán automáticamente con CSS order en responsive */}
        <CardImage />
        <CardPersonalInformation />
        <CardUbication />
        <CardOrders cartItems={cartItems || []} />
        
        {/* Botón para redirigir a /orders */}
        <button className="orders-button" onClick={goToOrders}>
          Ver Pedidos Realizados
        </button>
      </main>
    </div>
  );
};

export default Profile;
