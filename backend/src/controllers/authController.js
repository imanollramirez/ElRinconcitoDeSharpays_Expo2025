import jwt from "jsonwebtoken";
import { config } from "../config.js";
import Costumer from "../models/costumer.js";

const authController = {};

authController.authVerification = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT.secret);

    const user = await Costumer.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      token,
      userId: user._id,
      userType: user.userType,
      name: user.name,
      image: user.image,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};


export default authController;
