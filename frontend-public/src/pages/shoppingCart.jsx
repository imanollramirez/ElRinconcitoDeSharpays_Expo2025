import React from "react";
import { useNavigate } from "react-router-dom";
import useDataShoppingCart from "../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import ProductCartItem from "../components/productCardItem.jsx";
import CircularGallery from "../components/reactBits/CircularGallery.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import "../styles/shoppingCart.css";
import { Link } from "react-router-dom";

const ShoppingCartPage = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    total,
    createOrderFromCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    moveCartToOrderDetail,
  } = useDataShoppingCart();

  const subtotal = total;
  const deliveryFee = 0;

  const { user, isLoggedIn } = useAuth();
  const customerId = user?._id || user?.id;

  const handleCreateOrder = () => {
    if (!isLoggedIn) {
      ErrorAlert("Debes iniciar sesión para crear una orden");
      return;
    }

    if (cartItems.length === 0) return;

    const orderDetail = {
      items: cartItems,
      total,
      customerId,
    };

    localStorage.setItem("OrderDetail", JSON.stringify(orderDetail));
    navigate("/checkOut");
  };

  return (
    <div className="shopping-cart-page">
      <div className="carousel-wrapper">
        <CircularGallery />
      </div>

      <div className="cart-content">
        <h2 className="cart-title-main">Carrito de Compras</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
          <div className="d-flex justify-content-around">
            <div className="cart-layout w-100">
              <div className="cart-items-section">
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <ProductCartItem
                      key={item.key}
                      item={item}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="payment-method-container">
              <div className="summary-row">
                <span>SubTotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Envío/Entrega</span>
                <span style={{ color: "#e65c95ff" }}>$3.39</span>
              </div>

              <div className="summary-row">
                <span>Estimado Total</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
                
              {cartItems.length > 0 ? (
          <>
            <div className="d-flex flex-column">
              <div className="w-100">
                <Link
                  type="submit"
                  className="purchase-button text-center text-decoration-none text-white"
                  to={"/checkOut"}
                  onClick={handleCreateOrder}
                >
                  Comprar
                </Link>
              </div>

              <div className="w-100">
                <button
                  className="purchase-button bg-black text-white p-3 rounded-3"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </>
        ) : null}

            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
