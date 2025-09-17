import Order from "../models/orders.js";
import mongoose from "mongoose";

const orderController = {};

// Crear una orden
orderController.createOrder = async (req, res) => {
  try {
    const { customerId, categoryId, orderDetails, total, status, shippingAddress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "ID de cliente no válido" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "ID de categoría (tienda) no válido" });
    }

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(400).json({ message: "Debe haber al menos un producto en la orden" });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: "Dirección de envío incompleta" });
    }

    // Crear la orden en la base de datos (sin modificar aún el stock)
    const order = new Order({
      customerId,
      categoryId,
      orderDetails,
      total,
      status: status || "pendiente",
      shippingAddress,
    });

    await order.save();

    // Actualizar el stock de los productos en la orden
    for (const item of orderDetails) {
      const product = await Product.findById(item.productId); // Encuentra el producto

      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }

      // Verificar si hay suficiente stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `No hay suficiente stock para el producto ${product.name}` });
      }

      // Reducir el stock
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json(order); // Devolver la orden creada
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las órdenes con info del cliente y tienda
orderController.getOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .populate("customerId", "name email")
      .populate("categoryId", "category image")
      .populate("orderDetails.productId", "name price");

    // Agregar URL absoluta para las imágenes
    orders = orders.map(order => {
      if (order.categoryId?.image && !order.categoryId.image.startsWith('http')) {
        order.categoryId.image = `${process.env.API_URL}/${order.categoryId.image}`;
      }
      return order;
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
};


// Obtener orden por ID
orderController.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {  
      return res.status(400).json({ message: "ID de orden no válido" });
    }

    const order = await Order.findById(id)
      .populate("customerId", "name email")
      .populate("categoryId", "category image")
      .populate("orderDetails.productId", "name price");

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden" });
  }
};

// Actualizar orden
orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de orden no válido" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) return res.status(404).json({ message: "Orden no encontrada" });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar orden
orderController.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de orden no válido" });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return res.status(404).json({ message: "Orden no encontrada" });

    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden" });
  }
};

export default orderController;
