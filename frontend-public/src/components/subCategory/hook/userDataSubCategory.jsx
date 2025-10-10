
import { useState, useEffect } from "react";

const useUserDataSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/subCategory"); 
      if (!res.ok) throw new Error("Error al obtener subcategorías");
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return { subcategories };
};

export default useUserDataSubcategories;
