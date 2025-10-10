import Costumer from '../models/costumer.js';

// Obtener todos los clientes
export const getCostumers = async (req, res) => {
  try {
    const costumers = await Costumer.find();
    res.status(200).json(costumers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un cliente 
export const getCostumerById = async (req, res) => {
  try {
    const costumer = await Costumer.findById(req.params.id);
    if (!costumer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(costumer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCostumer = async (req, res) => {
  try {
    const costumer = await Costumer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!costumer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(costumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar el departamento del cliente
export const updateCostumerDepartment = async (req, res) => {
  try {
    const { department } = req.body; // Obtenemos el nuevo departamento del cuerpo de la solicitud
    
    // Validar que el campo 'department' no esté vacío
    if (!department || department.trim() === "") {
      return res.status(400).json({ error: "El departamento es obligatorio." });
    }

    // Buscar el cliente por ID y actualizar el departamento
    const costumer = await Costumer.findByIdAndUpdate(
      req.params.id, // Usamos el ID del cliente que está en la URL
      { department }, // Actualizamos solo el campo 'department'
      { new: true, runValidators: true } // Retorna el cliente actualizado y aplica validadores
    );

    if (!costumer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Devolvemos el cliente actualizado con el mensaje de éxito
    res.status(200).json({ message: 'Departamento actualizado con éxito', costumer });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar cliente
export const deleteCostumer = async (req, res) => {
  try {
    const costumer = await Costumer.findByIdAndDelete(req.params.id);
    if (!costumer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
