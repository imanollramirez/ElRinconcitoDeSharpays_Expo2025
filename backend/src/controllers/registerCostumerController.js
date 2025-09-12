import Costumer from "../models/costumer.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import crypto from "crypto";

import { sendEmail,  HTMLVerifyAccountEmail} from "../utils/mailPasswordRecovery.js";

const registerCostumerController = {};

registerCostumerController.register = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    
    const existingCostumer = await Costumer.findOne({ email });
    if (existingCostumer) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }

  
    const passwordHash = await bcryptjs.hash(password, 10);

  
    const newCostumer = new Costumer({
      name,
      email,
      password: passwordHash,
      department,
    });

    await newCostumer.save();
    /*jsonwebtoken.sign(
      { id: newCostumer._id },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) {
          console.error("Error al generar el token:", error);
          return res.status(500).json({ message: "Error al generar el token" });
        }

       Guardar token en cookie
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24, // 1 día
          sameSite: "strict",
        });

      }
    )
    */
    
    // Generar un código de verificación único
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Create JWT
    const tokenCode = jwt.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    // Guardar el token en la cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });


    await sendEmail(
      email,
      "Código de verificación de cuenta",
      "Te saludamos de parte del equipo de El Rinconcito de Sharpays",
      HTMLVerifyAccountEmail(verificationCode)
    );


    // Enviar una respuesta con el código de verificación
    res.status(201).json({
      message:
        "Cliente registrado. Porfavor revise su correo electrónico.",
      token: tokenCode, // Devolver el token para verificación posterior
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
    return res.status(401).json({ message: "No verification token provided" });
  }

  try {
    // Verificar y decodificar el JWT
    const decoded = jwt.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    // Comparar el código recibido con el almacenado en el JWT
    if (verificationCode !== storedCode) {
      return res.status(400).json({ message: "Código de verificación no válido." });
    }

    // Marcar al cliente como verificado
    const costumer = await Costumer.findOne({ email });
    if (!costumer) {
      return res.status(404).json({ message: "costumer not found" });
    }

    // Actualizar el campo de verificación
    costumer.isVerified = true;
    await costumer.save();
    // Limpiar la cookie después de la verificación
    res.clearCookie("verificationToken");

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

registerCostumerController.resendVerificationCode =  async (req, res) => {
  const { email, userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Falta userId" });

  try {
    const user = await Costumer.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Generar un código de verificación único
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Create JWT
    const tokenCode = jwt.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2h" }
      );

      // Guardar el token en la cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });


    await sendEmail(
      email,
      "Código de verificación de cuenta",
      "Te saludamos de parte del equipo de El Rinconcito de Sharpays",
      HTMLVerifyAccountEmail(verificationCode)
    );

    // Enviar una respuesta con el código de verificación
    res.status(201).json({
      message:
        "Código enviado. Porfavor revise su correo electrónico.",
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default registerCostumerController;
