import jwt from "jsonwebtoken";
import { config } from "../config.js";
import Costumer from "../models/costumer.js";

const authController = {};

authController.authVerification = async (req, res) => {
  try {
    // Intentar obtener el token desde cookies O desde Authorization header
    let token = req.cookies.authToken;
    
    // Si no hay token en cookies, buscarlo en el header Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remover "Bearer " del inicio
      }
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT.secret);

    // Buscar el usuario según el tipo
    let user;
    if (decoded.userType === 'admin') {
      // Para admin, crear objeto user básico
      user = {
        _id: 'admin',
        name: 'Admin',
        email: config.ADMIN.emailAdmin,
        userType: 'admin',
        image: '',
        isVerified: true
      };
    } else {
      // Para customers, buscar en la base de datos
      user = await Costumer.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: decoded.userType || user.userType,
        image: user.image || '',
        isVerified: user.isVerified || false,
      }
    });
    
  } catch (error) {
    console.error("Error en authVerification:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default authController;