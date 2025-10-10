import React, { useState, useEffect } from "react";
import SuccessAlert from "../../SuccessAlert.jsx";
import ErrorAlert from "../../ErrorAlert.jsx";

const useUserDataProducts = () => {
  const ApiProducts = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/Products";

  // Campos comunes
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");     // Mini tienda
  const [subCategoryId, setSubCategoryId] = useState(""); // Categoría producto
  const [image, setImage] = useState("");
  const [tipoObjeto, setTipoObjeto] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);

  // NUEVO: estado para sabor (flavor)
  const [flavor, setFlavor] = useState("");

  // Campos dinámicos (otherFields)
  const [otherFields, setOtherFields] = useState({}); 

  const [errorProduct, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Limpia el formulario
  const cleanData = () => {
    setId("");
    setName("");
    setDescription("");
    setStock("");
    setPrice("");
    setCategoryId("");
    setSubCategoryId("");
    setImage("");
    setFlavor("");  // Limpiar sabor también
    setOtherFields({});
    setError(null);
    setSuccess(null);
  };

  // Fetch productos
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(ApiProducts);
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatabyId = async (id) => {
    try {
      const response = await fetch(`${ApiProducts}/${id}`);
      if (!response.ok) throw new Error("Producto no encontrado");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  };

  // Crear nuevo producto
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Solo si recibimos el evento
    }
    
    try {
      setLoading(true);
    
      // Crear el objeto nuevo producto
      const newProduct = {
        name,
        description,
        stock,
        price,
        categoryId,
        subCategoryId,
        image,
        ...otherFields,
        sabor: flavor,  // Agregar sabor explícitamente si lo quieres en la API
      };
    
      const response = await fetch(ApiProducts, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    
      if (!response.ok) throw new Error("Error al crear producto");
    
      SuccessAlert("Producto creado correctamente");
      setSuccess("Producto creado correctamente");
      cleanData();
      fetchData();
    
    } catch (error) {
      ErrorAlert("Error al crear producto: " + error.message);
      console.error("Error crear producto:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${ApiProducts}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar producto");
  
      SuccessAlert("Producto eliminado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error eliminar producto:", error);
    }
  };

  // Cargar datos en formulario para edición
  const updateProduct = (product) => {
  setId(product._id);
  setName(product.name);
  setDescription(product.description);
  setStock(product.stock);
  setPrice(product.price);
  setCategoryId(product.categoryId);
  setSubCategoryId(product.subCategoryId);
  setImage(product.image);

  // Extraer sabor (flavor) de varias formas
  const { name, description, stock, price, categoryId, subCategoryId, image, sabor, flavor: flavorAlt, _id, __v, ...rest } = product;

  setFlavor(sabor || flavorAlt || rest.sabor || ""); // Asegurarte de traerlo sí o sí
  setOtherFields(rest);

  // Cargar bien el tipoObjeto (subcategoría)
  setTipoObjeto(
    typeof product.subCategoryId === "object"
      ? product.subCategoryId._id
      : product.subCategoryId
  );

  // Tallas si las hay
  setSelectedSizes(product.size || rest.size || []);

  setError(null);
  setSuccess(null);
};


  // Guardar cambios edición
  const handleUpdate = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Solo si recibimos el evento
    }
  
    try {
      setLoading(true);
      const updatedProduct = {
        name,
        description,
        stock,
        price,
        categoryId,
        subCategoryId,
        image,
        ...otherFields,
        sabor: flavor,  // Asegurarte de incluir sabor también aquí
      };
  
      const response = await fetch(`${ApiProducts}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
  
      if (!response.ok) throw new Error("Error al actualizar producto");
  
      SuccessAlert("Producto actualizado correctamente");
      setSuccess("Producto actualizado correctamente");
      cleanData();
      fetchData();
    } catch (error) {
      console.error("Error actualizar producto:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    id,
    setId,
    name,
    setName,
    description,
    setDescription,
    stock,
    setStock,
    price,
    setPrice,
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
    image,
    setImage,
    flavor,     // <---- lo agregamos acá
    setFlavor,  // <---- y acá también
    otherFields,
    setOtherFields,
    errorProduct,
    setError,
    success,
    setSuccess,
    loading,
    products,
    setProducts,
    cleanData,
    fetchData,
    fetchDatabyId,
    handleSubmit,
    deleteProduct,
    updateProduct,
    handleUpdate,
    selectedSizes, 
    setSelectedSizes,
    tipoObjeto,
    setTipoObjeto
  };
};

export default useUserDataProducts;
