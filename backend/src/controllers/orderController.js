import Order from "../models/orders.js";
import mongoose from "mongoose";


const orderController = {};

// Crear una orden
import Product from "../models/products.js"; // Asegúrate de importar el modelo de Product

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

    // Crear la orden
    const order = new Order({
      customerId,
      categoryId,
      orderDetails,
      total,
      status: status || "pending",
      shippingAddress,
    });

    // Guardar la orden
    await order.save();

    // Actualizar el stock de los productos comprados
    for (let i = 0; i < orderDetails.length; i++) {
      const orderItem = orderDetails[i];
      const product = await Product.findById(orderItem.productId);

      console.log(`Producto encontrado: ${product?.name}, Stock actual: ${product?.stock}`); // Log del producto encontrado

      if (product) {
        // Verificar que haya suficiente stock
        if (product.stock >= orderItem.quantity) {
          // Reducir el stock
          product.stock -= orderItem.quantity;

          console.log(`Nuevo stock para ${product.name}: ${product.stock}`); // Log del nuevo stock

          // Guardar el producto actualizado
          await product.save();

          console.log(`Producto ${product.name} actualizado correctamente.`); // Log de éxito
        } else {
          // Si no hay suficiente stock, lanzar error
          return res.status(400).json({ message: `No hay suficiente stock para el producto ${product.name}` });
        }
      } else {
        return res.status(404).json({ message: `Producto con ID ${orderItem.productId} no encontrado` });
      }
    }

    res.status(201).json(order);
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
