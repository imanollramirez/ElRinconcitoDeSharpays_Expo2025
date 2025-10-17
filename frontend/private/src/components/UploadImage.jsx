import React, { useState, useEffect, useRef } from "react";
import defaultImg from "../assets/profile-img-default.png";


const UploadImage = ({ onUpload, defaultImage, fromProfile = false}) => {
  const [preview, setPreview] = useState(defaultImage);
  const fileInputRef = useRef(null);

  // Limpia el preview y el input file cuando defaultImage cambia a vacío
  useEffect(() => {
    setPreview(defaultImage);
    if (!defaultImage && fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpia el input file
    }
  }, [defaultImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload(file); // Pasa el archivo al padre
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <div style={{ textAlign: "center", marginLeft: "40px" }}>
      <div className="image-con"
        style={{
          width: "300px",
          height: "300px",
          backgroundColor: "#eee",
          borderRadius: "8px 8px 0 0",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      {
        !fromProfile ? (
          <button
        type="button"
        onClick={handleButtonClick}
        style={{
          marginTop: "0px",
          backgroundColor: "#000",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "0 0 8px 8px",
          cursor: "pointer",
          fontWeight: "bold",
          border: "none",
          width: "300px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          outline: "none",
          fontSize: "16px",
        }}
      >
        Subir imagen
      </button>
        ) : null
      }

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadImage;
