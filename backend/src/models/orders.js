import { Schema, model } from "mongoose";

// Primero defines itemSchema
const itemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product", 
    required: false,
  },
  productName: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  customDesign: {
    type: String,
    default: null,
  },
});

// Luego defines shippingAddressSchema (si aplica)
const shippingAddressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
});

// Ahora sí, defines orderSchema usando itemSchema
const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customer", 
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category", 
      required: false,
    },
    orderDetails: {
      type: [itemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Debe haber al menos un producto en la orden",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
   status: {
  type: String,
  enum: ["pendiente", "pagado", "entregado", "completado", "cancelado"],
  default: "pendiente", 
},
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("order", orderSchema);
