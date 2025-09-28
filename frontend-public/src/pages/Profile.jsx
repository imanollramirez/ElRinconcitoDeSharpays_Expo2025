import React from "react";
import CardOrders from "../components/CardOrders.jsx";
import CardPersonalInformation from "../components/CardPersonalInformation.jsx";
import CardUbication from "../components/CardUbication.jsx";
import CardImage from "../components/CardImageProfile.jsx";
import useDataShoppingCart from "../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import "../styles/Profile.css";

const Profile = () => {
  const { cartItems } = useDataShoppingCart();

  return (
    <div className="profile-container">
      <main>
        {/* Los componentes se ordenarán automáticamente con CSS order en responsive */}
        <CardImage />
        <CardPersonalInformation />
        <CardUbication />
        <CardOrders cartItems={cartItems || []} />
      </main>
    </div>
  );
};

export default Profile;
