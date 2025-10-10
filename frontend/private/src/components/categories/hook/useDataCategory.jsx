import { useState, useEffect } from "react";

const useDataCategories = () => {
  const API = "https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/categories";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");  // Cambié details por imageUrl
  const [isActive, setIsActive] = useState(true);

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(API);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener las categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Limpiar el formulario y regresar a la lista
  const resetForm = () => {
    setId("");
    setDescription("");
    setCategory("");
    setImageUrl("");  // Limpiar imagen
    setIsActive(true);
    setActiveTab("list");
  };

  // Guardar nueva categoría
  const saveCategory = async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append("description", categoryData.description);
      formData.append("category", categoryData.category);
      formData.append("isActive", categoryData.isActive);
      
      if (categoryData.imageUrl && typeof categoryData.imageUrl !== "string") {
        formData.append("image", categoryData.imageUrl); // Subir imagen si existe
      }

      const response = await fetch(API, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Error al insertar categoría");
      }

      fetchCategories();  // Actualizar la lista
      resetForm();        // Limpiar el formulario
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Actualizar una categoría existente
  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isActive", isActive);
      
      if (imageUrl && typeof imageUrl !== "string") {
        formData.append("image", imageUrl); // Subir imagen si existe
      }

      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Error al actualizar categoría");
      }

      fetchCategories();  // Actualizar la lista
      resetForm();        // Limpiar el formulario
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Eliminar una categoría
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar categoría");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Para editar: cargar los datos en el formulario
  const updateCategory = (cat) => {
    setId(cat._id);
    setDescription(cat.description);
    setCategory(cat.category);
    setImageUrl(cat.image || "");  // Asignar imagen
    setIsActive(cat.isActive);
    setActiveTab("form");
  };

  return {
    activeTab,
    setActiveTab,
    id,
    setId,
    description,
    setDescription,
    category,
    setCategory,
    imageUrl,
    setImageUrl,  // Manejo de la imagen
    isActive,
    setIsActive,
    categories,
    loading,
    saveCategory,
    deleteCategory,
    updateCategory,
    handleEdit,  // Asegúrate de pasar esta función a los componentes donde la necesites
    resetForm,
  };
};

export default useDataCategories;
