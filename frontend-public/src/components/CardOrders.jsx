import React, { useEffect, useState } from "react";
import orderslogo from "../assets/orderslogoprofile.png";
import useOrdersWithCategories from "../components/order/hook/useOrders";
import "../styles/CardOrders.css";

const CardOrders = () => {
  const { orders, loading, error, updateOrder, refresh } = useOrdersWithCategories();
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

  // Refrescar órdenes cuando cambie el customerId
  useEffect(() => {
    if (customerId) {
      refresh();
    }
  }, [customerId]);

  // Debug: log para ver qué está pasando
  console.log("CardOrders Debug:", {
    customerId,
    totalOrders: orders.length,
    orders: orders,
    loading,
    error,
    debugInfo
  });

  // Filtrar las órdenes por customerId Y solo mostrar las pendientes
  const customerOrders = orders.filter(order => {
    if (order.customerId && order.customerId._id) {
      return order.customerId._id === customerId && order.status === 'pendiente';
    }
    return false;
  });

  console.log("Filtered customer orders (pendientes):", customerOrders);

  // Si no hay customerId, mostrar mensaje con info de debug
  if (!customerId) {
    return (
      <div className="card-orders">
        <div className="card-orders__header">
          <h2 className="header-title">Pedidos Pendientes</h2>
        </div>
        <div className="card-orders__body">
          <p className="card-orders__text">
            {debugInfo.cookieCount > 0 || debugInfo.localStorageCount > 0 || debugInfo.sessionStorageCount > 0
              ? `Storage encontrado - Cookies: ${debugInfo.cookieCount}, LocalStorage: ${debugInfo.localStorageCount}, SessionStorage: ${debugInfo.sessionStorageCount}. Revisa la consola.`
              : "No se encontró información de usuario en ningún storage."
            }
          </p>
          {/* Botón temporal para debug */}
          <button 
            onClick={() => console.log("Debug completo:", debugInfo)}
            style={{
              padding: '10px',
              background: '#ff3399',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Ver Debug en Consola
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card-orders">
        <div className="card-orders__header">
          <h2 className="header-title">Pedidos Pendientes</h2>
        </div>
        <div className="card-orders__body">
          <p className="card-orders__text">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-orders">
        <div className="card-orders__header">
          <h2 className="header-title">Pedidos Pendientes</h2>
        </div>
        <div className="card-orders__body">
          <p className="card-orders__text">Error al cargar pedidos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-orders">
      <div className="card-orders__header">
        <h2 className="header-title">Pedidos Pendientes</h2>
      </div>
      <div className="card-orders__body">
        {customerOrders.length === 0 ? (
          <>
            <img src={orderslogo} alt="No tienes pedidos pendientes" className="card-orders__image" />
            <p className="card-orders__text">No tienes pedidos pendientes</p>
          </>
        ) : (
          <div className="orders-list">
            {customerOrders.map((order) => (
              <div key={order._id} className="order-card-mini">
                <div className="order-card-header">
                  <div className="order-info">
                    <p className="order-id">Orden #{order._id.slice(-4)}</p>
                    <span className={`status-badge ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.orderDetails.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-details">
                        <p className="order-item-name">{item.productName}</p>
                        <div className="order-item-info">
                          <span>Cantidad: {item.quantity}</span>
                          <span>Precio: ${item.unitPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-total">
                  <strong>Total: ${order.total.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardOrders;