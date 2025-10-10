import { useState, useEffect } from 'react';

const useDataAdvertisement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/advertisements';

  // Obtener todos los anuncios
  const fetchAdvertisements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setAdvertisements(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching advertisements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo anuncio
  const createAdvertisement = async (advertisementData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(advertisementData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el anuncio');
      }

      const newAdvertisement = await response.json();
      setAdvertisements(prev => [...prev, newAdvertisement]);
      return newAdvertisement;
    } catch (err) {
      setError(err.message);
      console.error('Error creating advertisement:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un anuncio existente
  const updateAdvertisement = async (id, advertisementData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(advertisementData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el anuncio');
      }

      const updatedAdvertisement = await response.json();
      setAdvertisements(prev => 
        prev.map(ad => ad._id === id ? updatedAdvertisement : ad)
      );
      return updatedAdvertisement;
    } catch (err) {
      setError(err.message);
      console.error('Error updating advertisement:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un anuncio
  const deleteAdvertisement = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el anuncio');
      }

      setAdvertisements(prev => prev.filter(ad => ad._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting advertisement:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NUEVA: Función para cambiar el estado de un anuncio
  const toggleAdvertisementStatus = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}/toggle-status`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar el estado del anuncio');
      }

      const result = await response.json();
      
      // Actualizar el estado local del anuncio
      setAdvertisements(prev => 
        prev.map(ad => ad._id === id ? { ...ad, status: result.newStatus } : ad)
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error toggling advertisement status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un anuncio por ID
  const getAdvertisementById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const advertisement = await response.json();
      return advertisement;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching advertisement by id:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar anuncios al montar el componente
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  return {
    // Estado
    advertisements,
    loading,
    error,
    
    // Métodos
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementById,
    toggleAdvertisementStatus, // Nueva función exportada
    clearError,
    
    // Método para refrescar datos
    refreshAdvertisements: fetchAdvertisements,
  };
};

export default useDataAdvertisement;