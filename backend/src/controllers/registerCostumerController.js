import Costumer from "../models/costumer.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import crypto from "crypto";

import { sendEmail, HTMLVerifyAccountEmail } from "../utils/mailPasswordRecovery.js";

const registerCostumerController = {};

registerCostumerController.register = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    // Check if customer already exists
    const existingCostumer = await Costumer.findOne({ email });
    if (existingCostumer) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create new customer
    const newCostumer = new Costumer({
      name,
      email,
      password: passwordHash,
      department,
      isVerified: false // Explicitly set as unverified
    });

    await newCostumer.save();
    
    // Generate a 6-character verification code
    const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Create JWT with customer ID and verification code
    const tokenCode = jwt.sign(
      { 
        customerId: newCostumer._id,
        email, 
        verificationCode 
      },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    // Save token in secure cookie only
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    // Send verification email
    await sendEmail(
      email,
      "Código de verificación de cuenta",
      "Te saludamos de parte del equipo de El Rinconcito de Sharpays",
      HTMLVerifyAccountEmail(verificationCode)
    );

    // Return success without exposing the token
    res.status(201).json({
      message: "Cliente registrado. Por favor revise su correo electrónico.",
      customerId: newCostumer._id
    });

  } catch (error) {
    console.error("Error al registrar el cliente:", error);
    res.status(500).json({ message: "Error al registrar el cliente" });
  }
};

registerCostumerController.verifyAccount = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken; 
  
  if (!token) {
    return res.status(401).json({ message: "No se encuentra el token." });
  }
  
  try {
    // Verificar y decodificar el JWT
    const decoded = jwt.verify(token, config.JWT.secret);
    const { customerId, verificationCode: storedCode } = decoded;

    // Comparar el código recibido con el almacenado en el JWT
    if (verificationCode.trim().toLowerCase() !== storedCode.toLowerCase()) {
    return res.status(400).json({ message: "El código no coincide." });
    }

    // Marcar al cliente como verificado
    const costumer = await Costumer.findById(customerId);
    if (!costumer) {
      return res.status(404).json({ message: "Cliente no encontrado."});
    }

    // Actualizar el campo de verificación
    costumer.isVerified = true;
    await costumer.save();
    // Limpiar la cookie después de la verificación
    res.clearCookie("verificationToken");

    res.status(200).json({ message: "Cuenta verificada correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hubo un error: ", error: error.message });
  }
};

export default registerCostumerController;