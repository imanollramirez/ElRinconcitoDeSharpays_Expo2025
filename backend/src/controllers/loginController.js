import customersModel from "../models/costumer.js";
import employeesModel from "../models/employee.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import { sendEmail } from "../utils/mailPasswordRecovery.js"; // Ajusta la ruta según tu estructura

const loginController = {};

// Función para generar el HTML del correo de bloqueo
const HTMLBlockEmail = () => {
  return `
    <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="background-color: #fce4ec; font-family: Arial, sans-serif;">
      <tr>
        <td align="center" valign="middle">
          <table width="500" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #f8c0d8;">
            <tr>
              <td align="center">
                <img src="https://res.cloudinary.com/devkosnau/image/upload/v1749408388/33_20250412_034441_0000_mmzvs7.png" width="180" alt="Logo" />
                <h2 style="color: #c54270;">Cuenta Bloqueada</h2>
                <p style="font-size: 18px; color: #e26e97; font-weight: bold; margin: 20px 0;">Su cuenta ha sido bloqueada por 20 minutos</p>
                <p style="color: #c54270; font-size: 16px;">Ha superado el máximo de intentos de inicio de sesión permitidos.</p>
                <hr style="border: none; border-top: 2px solid #f8c0d8; width: 80%; margin: 20px 0;" />
                <p style="font-size: 14px; color: #c54270;"><em><b>Si no fue usted quien intentó acceder a su cuenta, le recomendamos cambiar su contraseña.</b></em></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

// LOGIN PRIVATE - Only Employees
loginController.loginPrivate = async (req, res) => {
  let { email, password } = req.body;

  // Normalizamos el correo
  email = email?.trim().toLowerCase();

  try {
    let userFound;
    let userType;

    // 1. Admin
    if (
      email === config.ADMIN.emailAdmin.toLowerCase() &&
      password === config.ADMIN.password
    ) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      // 2. Empleados
      userFound = await employeesModel.findOne({ email });
      userType = "employee";
    }

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verificar si la cuenta está bloqueada (solo para empleados)
    if (userType !== "admin") {
      if (userFound.timeOut > Date.now()) {
        const remainingTime = Math.ceil((userFound.timeOut - Date.now()) / 60000);
        return res.status(403).json({ message: "Block account. Remaining time: " + remainingTime + " minutes" });
      }
    }

    if (userType !== "admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        // Debug: Ver valores actuales
        console.log("Intentos actuales:", userFound.loginAttemps);
        
        // Si se equivoca en la contraseña, sumamos el intento fallido.
        userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;
        
        console.log("Intentos después de incrementar:", userFound.loginAttemps);

        if (userFound.loginAttemps >= 3) {
          // Bloqueamos la cuenta por 20 minutos
          userFound.timeOut = Date.now() + 20 * 60 * 1000;
          console.log("Bloqueando cuenta...");
          await userFound.save();
          console.log("Cuenta guardada exitosamente");
          
          // Enviar email de bloqueo
          try {
            console.log("Intentando enviar email a:", userFound.email);
            await sendEmail(userFound.email, "Cuenta Bloqueada - Seguridad", "", HTMLBlockEmail());
            console.log("Email enviado exitosamente");
          } catch (emailError) {
            console.error("Error enviando email:", emailError);
            // Continúa aunque falle el email
          }
          
          console.log("Enviando respuesta de cuenta bloqueada");
          return res.status(403).json({ message: "Block Account" });
        }

        console.log("Guardando intentos fallidos...");
        await userFound.save();
        return res.status(400).json({ message: "Invalid password" });
      }

      // Si la contraseña es correcta, reiniciamos los intentos
      userFound.loginAttemps = 0;
      await userFound.save();
    }

    jsonwebtoken.sign(
      {
        id: userFound._id,
        userType,
        name: userFound.name,
        image: userFound.image,
        email: userFound.email,
      },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error generating token" });
        }

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });



        res.status(200).json({
          message: `${userType} login successful`,
          token,
          userId: userFound._id,
          userType,
          name: userFound.name,
          image: userFound.image,
          email: userFound.email,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// LOGIN PUBLIC - Only Customers
loginController.loginPublic = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;

    // 1. Admin
    if (
      email === config.ADMIN.emailAdmin &&
      password === config.ADMIN.password
    ) {
      userType = "admin";
      userFound = { _id: "admin", name: "Admin", image: "", email, password };
    } else {
      // 2. Customer
      userFound = await customersModel.findOne({ email });
      userType = "customer";
    }

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    if (userType === "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Verificar si la cuenta está bloqueada (solo para customers)
    if (userType !== "admin") {
      if (userFound.timeOut > Date.now()) {
        const remainingTime = Math.ceil((userFound.timeOut - Date.now()) / 60000);
        return res.status(403).json({ message: "Cuenta bloqueada. Timepo restante: " + remainingTime + " minutos" });
      }
    }

    if (userType !== "admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      
      if (!isMatch) {
        // Si se equivoca en la contraseña, sumamos el intento fallido.
        userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;
        
        if (userFound.loginAttemps >= 3) {
          // Bloqueamos la cuenta por 20 minutos
          userFound.timeOut = Date.now() + 20 * 60 * 1000;
          await userFound.save();
          // Enviar email de bloqueo
          try {
            await sendEmail(userFound.email, "Cuenta Bloqueada - Seguridad", "", HTMLBlockEmail());
          } catch (emailError) {
            return res.status("Error enviando email:", emailError);
            // Continúa aunque falle el email
          }
          
          return res.status(403).json({ message: "Cuenta bloqueada." });
        }

        await userFound.save();
        return res.status(400).json({ message: "Invalid password" });
      }

      // Si la contraseña es correcta, reiniciamos los intentos
      userFound.loginAttemps = 0;
      await userFound.save();
    }

    // Generar token
    jsonwebtoken.sign(
      {
        id: userFound._id,
        userType,
        name: userFound.name,
        image: userFound.image,
        email: userFound.email,
      },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error generating token" });
        }

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });


        res.status(200).json({
          message: `${userType} login successful`,
          userId: userFound._id,
          userType,
          name: userFound.name,
          image: userFound.image,
          email: userFound.email,
          isVerified: userFound.isVerified
        });
      }
    );
  } catch (error) {
    console.log("ERROR EN CATCH:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
};

loginController.authVerification = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: "No hay sesión activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    res.status(200).json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        userType: decoded.userType,
        image: decoded.image,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};


export default loginController;