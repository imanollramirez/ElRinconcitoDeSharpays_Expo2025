import express from "express";
import * as costumerController from "../controllers/costumerController.js";

const router = express.Router();

// Rutas existentes
router
  .route("/")
  .get(costumerController.getCostumers);  // Obtener todos los clientes

router
  .route("/:id")
  .get(costumerController.getCostumerById)   // Obtener un cliente por su ID
  .put(costumerController.updateCostumer)     // Actualizar un cliente
  .delete(costumerController.deleteCostumer); // Eliminar un cliente

// Nueva ruta para actualizar el departamento de un cliente
router
  .route("/:id/updateDepartment")
  .put(costumerController.updateCostumerDepartment); // Actualizar solo el departamento

export default router;
