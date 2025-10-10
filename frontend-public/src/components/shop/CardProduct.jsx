// src/components/CardProduct.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/CardProduct.css";


const CardProduct = ({ producto }) => {
     
  const navigate = useNavigate();

  const getCategoryPath = (categoryId) => {
  switch (categoryId) {
    case "6855bf0c8bda3da90eca92c4":
      return "sharpays";
    case "68670dadd4a3c856571b7fb0":
      return "bougies"; 
    case "68670de0d4a3c856571b7fb1":
      return "frostyBites";
    case "68670dfcd4a3c856571b7fb2":
      return "paraiso";
    default:
      return "producto";
  }
};


 


  const handleProductInfo = () => {
  const id = producto._id.$oid || producto._id;
  const categoryId = producto.categoryId?._id || producto.categoryId;
  const path = getCategoryPath(categoryId);

  console.log(" Ruta final:", `/${path}/${id}`);
  navigate(`/${path}/${id}`);
};



  return (
    
    <div className="product-card" onClick={handleProductInfo}>
      <div className="product-image-container">
        <img src={producto.image} alt={producto.name} className="product-img" />
        
      </div>
      
      <p className="product-name">{producto.name}</p>
      <p className="product-price">${parseFloat(producto.price).toFixed(2)}</p>
    </div>
  );
};

export default CardProduct;
