import { config } from "../config.js";
import Advertisement from "../models/advertisement.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Para eliminar el archivo temporal después de subir

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret
});

const advertisementsController = {};

// GET all advertisements
advertisementsController.getdAvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find();
    res.json(advertisements);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Error al obtener anuncios", error });
  }
};

// CREATE advertisement
advertisementsController.createAdvertisement = async (req, res) => {
  try {
    const { description, status, tittle, ...otherFields } = req.body;
    let imageURL = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "advertisements",
        allowed_formats: ["png", "jpg", "jpeg"]
      });
      imageURL = result.secure_url;
    }

    const newAdvertisement = new Advertisement({
      description,
      status,
      tittle,
      image: imageURL,
      ...otherFields
    });

    await newAdvertisement.save();
    res.json({ message: "Anuncio creado exitosamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al crear el anuncio" });
    console.log(error);
  }
};

// UPDATE advertisement (con cambio de imagen si se envía)
advertisementsController.updateAdvertisements = async (req, res) => {
  try {
    const { description, status, tittle, ...otherFields } = req.body;
    let imageURL;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "advertisements",
        allowed_formats: ["png", "jpg", "jpeg"]
      });
      imageURL = result.secure_url;
    }

    const updatedData = {
      description,
      status,
      tittle,
      ...otherFields
    };

    if (imageURL) {
      updatedData.image = imageURL;
    }

    await Advertisement.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: "Anuncio actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el anuncio", error });
  }
};

// DELETE advertisement
advertisementsController.deleteAdvertisements = async (req, res) => {
  try {
    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: "Anuncio eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar el anuncio", error });
  }
};

// TOGGLE STATUS advertisement (cambiar solo el estado)
advertisementsController.toggleStatusAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    
    if (!advertisement) {
      return res.status(404).json({ message: "Anuncio no encontrado" });
    }

    // Cambiar el estado: si es "Activo" lo cambia a "Inactivo" y viceversa
    const newStatus = advertisement.status === "Activo" ? "Inactivo" : "Activo";
    
    await Advertisement.findByIdAndUpdate(
      req.params.id, 
      { status: newStatus }, 
      { new: true }
    );
    
    res.json({ 
      message: `Estado cambiado a ${newStatus}`,
      newStatus: newStatus 
    });
  } catch (error) {
    res.status(400).json({ message: "Error al cambiar el estado", error });
  }

}

export default advertisementsController;