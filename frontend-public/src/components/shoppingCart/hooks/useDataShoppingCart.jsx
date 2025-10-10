import { useState } from "react";

const API_CREATE_ORDER = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/createOrderFromCart/create-from-cart";

const useDataShoppingCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveToLocalStorage = (items) => localStorage.setItem("shoppingCart", JSON.stringify(items));

  const addToCart = (product, quantity = 1, options = {}) => {
    const key = `${product._id}_${options.size || ""}_${options.flavor || ""}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.key === key);
      let updatedCart;
      if (existing) {
        updatedCart = prev.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        const newItem = { key, product, quantity, options };
        updatedCart = [...prev, newItem];
      }
      saveToLocalStorage(updatedCart);
      console.log("Agregando al carrito - customProduct:", product);

      return updatedCart;
    });
  };

  const removeFromCart = (key) => {
    const updatedCart = cartItems.filter(item => item.key !== key);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  // 🔹 NUEVO: actualizar cantidad
  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(ci => ci.key === item.key ? { ...ci, quantity: newQuantity } : ci);
    setCartItems(updatedCart);
    saveToLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shoppingCart");
  };

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const createOrderFromCart = async (customerId, shippingAddress, status = "pendiente") => {
    setLoading(true);
    setError(null);
  
    try {
      const products = cartItems.map(item => {
        let imageUrl = item.product.image;



  
        // ✅ Si no hay image pero sí customDesign, usamos baseImage (taza o camisa)
        if (!imageUrl && item.product.customDesign) {
          imageUrl = item.product.baseImage || null;
        }
  
        // ✅ Si hay duaData, usamos esa prioridad
        if (item.product.duaData) {
          imageUrl = item.product.duaData.carnetImage || item.product.customDesign || imageUrl;
        }
  
        return {
          productId: item.product._id.startsWith("custom-") ? null : item.product._id,
          categoryId: item.product.categoryId?._id || null,
          productName: item.product.name,
          unitPrice: item.product.price,
          image: imageUrl,
          customDesign: item.product.customDesign || null,
          duaData: item.product.duaData || null,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          discount: 0
        };

        
      });
      console.log("Payload en createOrderFromCart:", payload);

      const payload = { customerId, products, shippingAddress, status };
  
      const res = await fetch(API_CREATE_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear la orden desde el carrito");
      }
  
      const data = await res.json();
      clearCart();
      return data;
    } catch (err) {
      console.error("❌ Error al crear orden:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  return {
    cartItems,
    total,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity, 
    clearCart,
    createOrderFromCart
  };
};

export default useDataShoppingCart;
