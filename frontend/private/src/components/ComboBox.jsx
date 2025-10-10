// src/components/SubCategoryComboBox.jsx
import React, { useEffect, useState } from "react";

const SubCategoryComboBox = ({ value, onChange, categoryFilter }) => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch("https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/subCategory");
        const data = await res.json();
        setSubcategories(data);
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    };

    fetchSubcategories();
  }, []);

  // FILTRAMOS LAS SUBCATEGORÍAS SEGÚN categoryFilter (si viene)
  const filteredSubcategories = subcategories.filter((sub) => {
    const cat =
      typeof sub.categoryId === "string"
        ? sub.categoryId
        : typeof sub.categoryId === "object"
        ? sub.categoryId.$oid || sub.categoryId._id
        : null;
    return categoryFilter ? cat === categoryFilter : true;
  });

  return (
    <div className="mb-4">
      
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={value}
        onChange={onChange}
      >
        <option value="">Selecciona una subcategoría</option>
        {filteredSubcategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubCategoryComboBox;
