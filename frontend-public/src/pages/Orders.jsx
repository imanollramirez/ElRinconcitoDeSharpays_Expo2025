import React, { useState, useEffect } from "react";
import CustomTitle from "../components/CustomTitle";
import CustomerOrderCard from "../components/ordercopy/CustomOrderCard.jsx";
import useOrdersWithCategories from "../components/order/hook/useOrders.jsx";
import "../styles/Orderss.css";

const CustomerOrderHistory = () => {
  const { orders, categories, loading, error } = useOrdersWithCategories();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [customerId, setCustomerId] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // Función para obtener todas las cookies
  const getAllCookies = () => {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  };

  // Función para decodificar JWT y obtener el user ID
  const getUserIdFromJWT = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      console.log('🔍 JWT decodificado:', payload);
      
      return payload.id || payload.userId || payload._id || payload.customerId || payload.sub;
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  };

  // Función para obtener el ID del usuario desde cookies, localStorage y sessionStorage
  const getUserIdFromStorage = () => {
    const allCookies = getAllCookies();
    console.log("🍪 Todas las cookies encontradas:", allCookies);
    
    // También revisar localStorage y sessionStorage
    const localStorage = {};
    const sessionStorage = {};
    
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        localStorage[key] = window.localStorage.getItem(key);
      }
    } catch (e) {
      console.log("No se pudo acceder a localStorage");
    }
    
    try {
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        sessionStorage[key] = window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.log("No se pudo acceder a sessionStorage");
    }
    
    console.log("💾 localStorage:", localStorage);
    console.log("📝 sessionStorage:", sessionStorage);
    
    // Lista de posibles nombres que podrían contener el user ID
    const possibleKeys = [
      'userId', 'user_id', 'customerId', 'customer_id', 
      'id', '_id', 'userInfo', 'user', 'userData', 'currentUser',
      'token', 'authToken', 'jwt', 'accessToken', 'auth'
    ];

    let userId = null;
    let foundIn = '';

    // Función para buscar en un storage específico
    const searchInStorage = (storage, storageName) => {
      for (const key of possibleKeys) {
        if (storage[key]) {
          const value = storage[key];
          console.log(`🔍 Revisando ${storageName}.${key}:`, value);
          
          // Si parece ser un JWT (tiene puntos)
          if (typeof value === 'string' && value.includes('.') && value.split('.').length === 3) {
            const decodedId = getUserIdFromJWT(value);
            if (decodedId) {
              return { userId: decodedId, foundIn: `JWT decodificado desde ${storageName}.${key}` };
            }
          }
          
          // Si parece ser JSON
          try {
            const parsed = JSON.parse(value);
            console.log(`📋 JSON parseado:`, parsed);
            
            const jsonId = parsed._id || parsed.id || parsed.userId || parsed.customerId;
            if (jsonId) {
              return { userId: jsonId, foundIn: `JSON desde ${storageName}.${key}` };
            }
          } catch (e) {
            // No es JSON, podría ser un ID directo
            if (typeof value === 'string' && value.length > 15 && !value.includes('=')) {
              return { userId: value, foundIn: `ID directo desde ${storageName}.${key}` };
            }
          }
        }
      }
      return null;
    };

    // Buscar en localStorage
    const localResult = searchInStorage(localStorage, 'localStorage');
    if (localResult) {
      userId = localResult.userId;
      foundIn = localResult.foundIn;
    }

    // Si no se encontró, buscar en sessionStorage  
    if (!userId) {
      const sessionResult = searchInStorage(sessionStorage, 'sessionStorage');
      if (sessionResult) {
        userId = sessionResult.userId;
        foundIn = sessionResult.foundIn;
      }
    }

    // Si no se encontró, buscar en cookies
    if (!userId) {
      const cookieResult = searchInStorage(allCookies, 'cookies');
      if (cookieResult) {
        userId = cookieResult.userId;
        foundIn = cookieResult.foundIn;
      }
    }

    const debugData = {
      allCookies,
      localStorage,
      sessionStorage,
      userId,
      foundIn,
      cookieCount: Object.keys(allCookies).length,
      localStorageCount: Object.keys(localStorage).length,
      sessionStorageCount: Object.keys(sessionStorage).length
    };

    setDebugInfo(debugData);
    console.log("🎯 Resultado final búsqueda usuario:", debugData);

    return userId;
  };

  // Obtener el customerId al montar el componente
  useEffect(() => {
    const userId = getUserIdFromStorage();
    console.log("✅ User ID final obtenido:", userId);
    
    if (userId) {
      setCustomerId(userId);
    } else {
      console.warn("❌ No se pudo obtener el ID del usuario desde ningún storage");
    }
  }, []);

  const storeNames = ["Todos", ...categories.map((c) => c.category)];

  // Filtrar pedidos completados por customerId y categoría
  const completedOrders = orders.filter((order) => {
    const isCategoryMatch = activeCategory === "Todos" || order.categoryId?.category === activeCategory;
    const isCompleted = order.status === "completado";
    const isCustomerOrder = order.customerId && order.customerId._id === customerId;
    
    return isCategoryMatch && isCompleted && isCustomerOrder;
  });

  console.log("Filtered completed orders for customer:", completedOrders);

  // Si no hay customerId, mostrar mensaje
  if (!customerId) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-11">
            <div className="orders-page">
              <div className="orders-wrapper">
                <div className="orders-content">
                  <CustomTitle text="Mi Historial de Pedidos" style="page-title" />
                  <p className="text-center">
                    {debugInfo.cookieCount > 0 || debugInfo.localStorageCount > 0 || debugInfo.sessionStorageCount > 0
                      ? `Storage encontrado - Cookies: ${debugInfo.cookieCount}, LocalStorage: ${debugInfo.localStorageCount}, SessionStorage: ${debugInfo.sessionStorageCount}. Revisa la consola.`
                      : "No se encontró información de usuario en ningún storage."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <div className="orders-page">
            <div className="orders-wrapper">
              <div className="orders-content">
                <CustomTitle text="Mi Historial de Pedidos" style="page-title" />

                <div className="store-tabs">
                  {storeNames.map((store) => (
                    <button
                      key={store}
                      className={`store-tab ${activeCategory === store ? "active" : ""}`}
                      onClick={() => setActiveCategory(store)}
                    >
                      {store}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <p className="text-center">Cargando historial...</p>
                ) : error ? (
                  <p className="text-danger text-center">{error}</p>
                ) : completedOrders.length === 0 ? (
                  <p className="text-center position-absolute top-50 start-50 translate-middle">
                    No tienes pedidos completados{activeCategory !== "Todos" ? ` en ${activeCategory}` : ""}.
                  </p>
                ) : (
                  <div className="orders-grid">
                    {completedOrders.map((order) => (
                      <CustomerOrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderHistory;