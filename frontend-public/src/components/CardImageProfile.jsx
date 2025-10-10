import React from "react";
import '../styles/CardImage.css';
import CustomButton from "./CustomButton";
import { useAuth } from "../context/AuthContext";

// Función para obtener las iniciales del nombre
const getInitials = (name) => {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

// Función para generar un color aleatorio consistente por usuario
const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = "#" + ((hash >> 24) & 0xff).toString(16).padStart(2, "0") +
                      ((hash >> 16) & 0xff).toString(16).padStart(2, "0") +
                      ((hash >> 8) & 0xff).toString(16).padStart(2, "0");
  return color;
};

const AvatarCard = () => {
  const { user, logout } = useAuth();
  const name = user?.name || "Usuario";
  const initials = getInitials(name);
  const bgColor = getColorFromString(name);

  return (
    <div className="upload-image-card">
      <div className="upload-image-preview">
        <div
          className="avatar-circle"
          style={{
            backgroundColor: bgColor,
            color: "white",
            fontSize: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            margin: "auto"
          }}
        >
          {initials}
        </div>
      </div>

      

      <CustomButton 
        text="Cerrar sesión"
        background="#000000ff"
        height={50}
        width={200}
        color="white"
        onClick={logout}
      />
    </div>
  );
};

export default AvatarCard;
