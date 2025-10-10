import nodemailer from "nodemailer";
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});


const sendEmail = async (to, subject, body, html) => {
  try {
    const info = await transporter.sendMail({
      from: "expo.impulsatec.2025@gmail.com",
      to,
      subject,
      body,
      html,
    });

    return info;
  } catch (error) {
    console.log("error" + error);
  }
};

// Función para generar el HTML del correo de recuperación de contraseña
const HTMLRecoveryEmail = (code) => {
  return `
      <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="background-color: #fce4ec; font-family: Arial, sans-serif;">
  <tr>
    <td align="center" valign="middle">
      <table width="500" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #f8c0d8;">
        <tr>
          <td align="center">
            <img src="https://res.cloudinary.com/devkosnau/image/upload/v1749408388/33_20250412_034441_0000_mmzvs7.png" width="180" alt="Logo" />
            <h2 style="color: #c54270;">Código de recuperación</h2>
            <p style="font-size: 36px; color: #e26e97; font-weight: bold; margin: 20px 0;">${code}</p>
            <p style="color: #c54270; font-size: 16px;">Este código es válido por 20 minutos.</p>
            <hr style="border: none; border-top: 2px solid #f8c0d8; width: 80%; margin: 20px 0;" />
            <p style="font-size: 14px; color: #c54270;"><em><b>Si no solicitaste este código, puedes ignorar este mensaje.</b></em></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>


    `;
};


const HTMLVerifyAccountEmail = (code) => {
  return `<table width="100%" height="100%" cellspacing="0" cellpadding="0" style="background-color: #fce4ec; font-family: Arial, sans-serif;">
  <tr>
    <td align="center" valign="middle">
      <table width="500" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #f8c0d8;">
        <tr>
          <td align="center">
            <img src="https://res.cloudinary.com/devkosnau/image/upload/v1749408388/33_20250412_034441_0000_mmzvs7.png" width="180" alt="Logo" />
            <h2 style="color: #c54270;">Código de verificación</h2>
            <p style="font-size: 36px; color: #e26e97; font-weight: bold; margin: 20px 0;">${code}</p>
            <p style="color: #c54270; font-size: 16px;">Este código es válido por 2 horas.</p>
            <hr style="border: none; border-top: 2px solid #f8c0d8; width: 80%; margin: 20px 0;" />
            <p style="font-size: 14px; color: #c54270;"><em><b>Si no solicitaste este código, puedes ignorar este mensaje.</b></em></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}



export { sendEmail, HTMLRecoveryEmail, HTMLVerifyAccountEmail };