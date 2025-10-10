import React, { useEffect, useState } from "react";
import "../styles/Sharpays.css"; 
import ShopMenu from "../components/SubMenu";
import bgImage from "../assets/sharpays.jpeg";
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

    const isSameCategory = cat === "6855bf0c8bda3da90eca92c4";
    const isSameSub = selectedSubcategory ? sub === selectedSubcategory : true;

    return isSameCategory && isSameSub;
  });

  return (
    <div className="page-wrapper">
      <div className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <h6 className="hero-subtitle">sharpays</h6>
        <h1 className="hero-title">BOUTIQUE</h1>
      </div>

      <div className="white-box">
        <ShopMenu
          categoryId="6855bf0c8bda3da90eca92c4"
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
