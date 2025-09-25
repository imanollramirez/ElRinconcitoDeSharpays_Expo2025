import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import BannerPrincipal from "../components/bannerPrincipal.jsx";
import CardProduct from "../components/shop/CardProduct.jsx";
import useProductsWithCategories from "../components/home/hooks/useProductsWithCategories.jsx";

// Importa el hook para los anuncios/eventos
import useDataAdvertisement from "../components/events/hook/useDataAdvertisement.jsx"; 

// Importa CardSwap y Card
import CardSwap, { Card } from "../components/reactBits/CardSwap.jsx"; 

// Importa el ícono de WhatsApp
import { FaWhatsapp } from "react-icons/fa";

const Home = () => {
  const { products, categories, loading, error } = useProductsWithCategories();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const categoryNames = categories.map((c) => c.category);

  // Obtener anuncios usando el hook
  const {
    advertisements,
    loading: loadingAds,
    error: errorAds,
    refreshAdvertisements,
  } = useDataAdvertisement();

  // Filtrar productos según categoría seleccionada
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "Todos") return true;
    return product.categoryId?.category === activeCategory;
  });

  // Mostrar máximo 1 producto por categoría (hasta 3 total)
  useEffect(() => {
    if (activeCategory === "Todos") {
      const selected = [];
      const usedCategories = new Set();

      for (let product of products) {
        const cat = product.categoryId?.category;
        if (cat && !usedCategories.has(cat)) {
          selected.push(product);
          usedCategories.add(cat);
        }
        if (selected.length === 3) break;
      }

      setDisplayedProducts(selected);
    } else {
      const filtered = products.filter(
        (p) => p.categoryId?.category === activeCategory
      );
      setDisplayedProducts(filtered);
    }
  }, [products, activeCategory]);

  const getCategoryCount = (categoryName) => {
    return products.filter((p) => p.categoryId?.category === categoryName).length;
  };

  // Filtrar sólo los eventos activos
  const activeEvents = advertisements.filter(ad => ad.status === "Activo");

  // Datos para WhatsApp
  const whatsappNumber = "69739953"; // Reemplaza con tu número
  const whatsappMessage = "Hola! Quiero más información.";

  return (
    <div className="main-container-Inicio">
      <BannerPrincipal />

      <div className="container-header-inicio">
        <p>
          ¡Nuevas ideas, mismo corazón!{" "}
          <span>Descubre lo más reciente y vendido de nuestra creatividad."</span>
        </p>
      </div>

      <div className="products-section">
        <div className="category-filters">
          <h3>Nuestras Tiendas:</h3>
          <div className="filter-buttons">
            {categoryNames.map((category) => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                <span className="category-count">{getCategoryCount(category)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="products-container">
          {loading && <div className="loading">Cargando productos...</div>}
          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && (
            <>
              <div className="products-grid-home">
                {displayedProducts.map((product) => (
                  <CardProduct key={product._id} producto={product} />
                ))}
              </div>

              {displayedProducts.length === 0 && (
                <div className="no-products">
                  <p>No hay productos disponibles en esta categoría</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Después de la sección de productos y antes de la de eventos */}
      <div className="events-header">
        <h2>Nuestros próximos eventos</h2>
      </div>

      <hr className="events-divider" />

      {/* Sección de eventos */}
      <div className="bottom-home-container">
        <div className="events-text">
          <h2>
            Aquí en El Rinconcito de Sharpay nos apasiona crear momentos especiales.
          </h2>
          <p>
            Estos eventos están diseñados para recaudar fondos y apoyar iniciativas que hacen la diferencia en nuestra comunidad. Te invitamos a ser parte y compartir la magia con nosotros.
          </p>
        </div>

        {/* Carrusel de eventos */}
        <div className="events-carousel">
          {loadingAds && <p>Cargando eventos...</p>}
          {errorAds && <p>Error cargando eventos: {errorAds}</p>}
          {!loadingAds && activeEvents.length > 0 && (
            <CardSwap
              cardDistance={60}
              verticalDistance={70}
              delay={5000}
              pauseOnHover={false}
            >
              {activeEvents.map((event) => (
                <Card key={event._id} className="event-card">
                  <h3>{event.tittle || "Evento sin título"}</h3>
                  <p>{event.description || "Sin descripción"}</p>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.tittle}
                    />
                  )}
                </Card>
              ))}
            </CardSwap>
          )}
          {!loadingAds && activeEvents.length === 0 && (
            <p>No hay eventos activos actualmente.</p>
          )}
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          textDecoration: "none",
        }}
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default Home;
