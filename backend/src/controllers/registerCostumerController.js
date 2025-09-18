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
    return res.status(401).json({ 
      message: "Token de verificación no encontrado. Por favor, solicite un nuevo código." 
    });
  }

  try {
    // Verify and decode JWT
    const decoded = jwt.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode, customerId } = decoded;

    // Compare verification codes (case-insensitive)
    if (verificationCode.toUpperCase() !== storedCode.toUpperCase()) {
      return res.status(400).json({ 
        message: "Código de verificación no válido." 
      });
    }

    // Find customer and verify
    const costumer = await Costumer.findById(customerId);
    if (!costumer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (costumer.isVerified) {
      return res.status(400).json({ 
        message: "La cuenta ya está verificada" 
      });
    }

    // Mark as verified
    costumer.isVerified = true;
    await costumer.save();
    
    // Clear verification cookie
    res.clearCookie("verificationToken");

    // Generate auth token for logged-in session
    const authToken = jwt.sign(
      { id: costumer._id, email: costumer.email },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "strict",
    });

    res.status(200).json({ 
      message: "Email verificado exitosamente",
      customer: {
        id: costumer._id,
        name: costumer.name,
        email: costumer.email
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "El código de verificación ha expirado. Por favor, solicite uno nuevo." 
      });
    }
    
    console.error("Error verifying email:", error);
    res.status(500).json({ 
      message: "Error verificando email", 
      error: error.message 
    });
  }
};

registerCostumerController.resendVerificationCode = async (req, res) => {
  const { email, userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ message: "Falta userId" });
  }

  try {
    const user = await Costumer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        message: "La cuenta ya está verificada" 
      });
    }

    // Generate new verification code
    const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Create new JWT
    const tokenCode = jwt.sign(
      { 
        customerId: user._id,
        email, 
        verificationCode 
      },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    // Save new token in cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    // Send new verification email
    await sendEmail(
      email,
      "Código de verificación de cuenta",
      "Te saludamos de parte del equipo de El Rinconcito de Sharpays",
      HTMLVerifyAccountEmail(verificationCode)
    );

    res.status(200).json({
      message: "Código enviado. Por favor revise su correo electrónico.",
    });

  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default registerCostumerController;