import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CamisaDetail from "../components/shop/DuaDetail";
import useDataProducts from "../components/products/hook/useUserDataProducts"

const CamisaDetailPage = () => {
  const { id } = useParams();
  const { fetchDatabyId } = useDataProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchDatabyId(id).then((data) => {
      setProduct(data);
    });
  }, [id, fetchDatabyId]);

  if (!product) return <p>Cargando producto...</p>;

  return <CamisaDetail product={product} />;
};

export default CamisaDetailPage;
