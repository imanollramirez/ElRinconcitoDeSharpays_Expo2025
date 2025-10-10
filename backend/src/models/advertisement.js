import { Schema, model } from "mongoose";

const AdvertisementsSchema = new Schema({
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    minlength: [3, "La descripción debe tener al menos 3 caracteres"],
    maxlength: [100, "La descripción no puede exceder 100 caracteres"]
  },
  status: {
    type: String,
    required: [true, "El status es obligatoria"],
    minlength: [3, "El status debe tener al menos 3 caracteres"],
    maxlength: [15, "El status no puede exceder 15 caracteres"]
  },
  tittle: {
    type: String,
    required: [true, "El titulo es obligatorio"],
    minlength: [3, "El titlo deben tener al menos 3 caracteres"],
    maxlength: [50, "El titulo no exceder 50 caracteres"]
  },
  image: {
    type: String,
    required: [true, "La imagen es obligatoria"]
  }
}, {
  timestamps: true,
  strict: false,
});

export default model("Advertisements", AdvertisementsSchema);