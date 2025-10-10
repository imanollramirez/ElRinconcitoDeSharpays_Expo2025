import React, { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import "../styles/UploadImage.css";

const UploadImageBox = ({ onUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); //  Asegúrate de que este preset exista en tu Cloudinary

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/devkosnau/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        onUpload(data.secure_url); // Devuelve solo la URL de Cloudinary
      } else {
        alert("Error al subir la imagen a Cloudinary");
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir la imagen");
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-boxX">
        <div className="upload-div">
          <FiUpload className="upload-icon" />
          <button className="upload-button" onClick={handleClick}>
            Cargar imagen
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadImageBox;
