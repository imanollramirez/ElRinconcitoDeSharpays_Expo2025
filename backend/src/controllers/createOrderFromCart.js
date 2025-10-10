import Order from '../models/orders.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from '../config.js';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret
});

// Función auxiliar para subir base64 a Cloudinary
const uploadBase64Image = async (base64) => {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "custom_designs"
  });
  return result.secure_url;
};

const createOrderFromCart = async (req, res) => {
  try {
    const { customerId, products, shippingAddress, status = "pendiente" } = req.body;

    if (!customerId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Faltan datos: customerId o productos vacíos" });
    }

    const processedProducts = await Promise.all(
      products.map(async (item) => {
        let imageUrl = item.image;

        if (item.customDesign?.startsWith("data:image")) {
          imageUrl = await uploadBase64Image(item.customDesign);
        }

        return {
          productId: item.productId || null, 
          categoryId: item.categoryId || null,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: imageUrl,
          quantity: item.quantity,
          totalPrice: item.unitPrice * item.quantity,
          discount: item.discount || 0,
          customDesign: item.customDesign ? imageUrl : null
        };
      })
    );

    const total = processedProducts.reduce((acc, item) => acc + item.totalPrice, 0);

    // Construir objeto de orden
    const orderData = {
      customerId,
      orderDetails: processedProducts,
      total,
      status,
      shippingAddress
    };

    // Asignar categoryId de algún producto registrado si existe
    const firstCategory = processedProducts.find(p => p.categoryId)?.categoryId;
    if (firstCategory) orderData.categoryId = firstCategory;

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);

  } catch (error) {
    console.error("Error creando la orden:", error);
    res.status(500).json({ message: "Error creando la orden desde el carrito", error: error.message });
  }
};


export default createOrderFromCart;
