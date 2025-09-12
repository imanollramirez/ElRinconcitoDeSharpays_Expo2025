import jwt from "jsonwebtoken";
import { config } from "../config.js";
import Costumer from "../models/costumer.js";

const authController = {};

authController.authVerification = async (req, res) => {
  try {
    const token = req.cookies.authToken; // cookie que guardamos en login

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verificamos el JWT
    const decoded = jwt.verify(token, config.JWT.secret);

    // Buscar el usuario
    const user = await Costumer.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        image: user.image,
      },
    });

  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default authController;
