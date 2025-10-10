// src/pages/ParaisoPage.jsx (o como se llame el archivo)
import React, { useEffect, useState } from "react";
import "../styles/Sharpays.css"; 
import ShopMenu from "../components/SubMenu";
import bgImage from "../assets/paraiso.jpeg";
import CardProduct from "../components/shop/CardProduct";
import useUserDataProducts from "../components/products/hook/useUserDataProducts";

const ShopPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const { products, fetchData } = useUserDataProducts();

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((prod) => {
    const cat =
      typeof prod.categoryId === "string"
        ? prod.categoryId
        : typeof prod.categoryId === "object"
        ? prod.categoryId.$oid || prod.categoryId._id
        : null;

    const sub =
      typeof prod.subCategoryId === "string"
        ? prod.subCategoryId
        : typeof prod.subCategoryId === "object"
        ? prod.subCategoryId._id || prod.subCategoryId.$oid
        : null;

    const isSameCategory = cat === "68670dfcd4a3c856571b7fb2";
    const isSameSub = selectedSubcategory ? sub === selectedSubcategory : true;

    return isSameCategory && isSameSub;
  });

  return (
    <div className="page-wrapper">
      <div className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <h6 className="hero-subtitle">El paraíso de</h6>
        <h1 className="hero-title2">DIOS</h1>
      </div>

      <div className="white-box">
        <ShopMenu
          categoryId="68670dfcd4a3c856571b7fb2"
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <CardProduct key={product._id} producto={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
