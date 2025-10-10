import React, { useState, useRef } from "react";
import "../../styles/DuasDetail.css";
import Card3D from "./Card3D";
import html2canvas from "html2canvas";
import useDataShoppingCart from "../../components/shoppingCart/hooks/useDataShoppingCart.jsx";
import SuccessAlert from "../../components/SuccessAlert.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { useNavigate } from "react-router-dom";

const DuasDetail = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useDataShoppingCart();

  const [data, setData] = useState({
    apellido: '',
    nombre: '',
    genero: '',
    nacimiento: '',
    emergencia: '',
    nacionalidad: '',
    foto: null,
    numero: `${Math.floor(100000 + Math.random() * 900000)}-1`,
  });

  const carnetRef = useRef(null);
  const previewFoto = data.foto ? URL.createObjectURL(data.foto) : null;

  // Subir imagen a Cloudinary
  const uploadToCloudinary = async (base64Image) => {
    if (!base64Image) return null;
    try {
      const formData = new FormData();
      formData.append("file", base64Image);
      formData.append("upload_preset", "preset_camisetas"); // tu preset real

      const res = await fetch("https://api.cloudinary.com/v1_1/dqmol5thk/image/upload", {
        method: "POST",
        body: formData,
      });

      const cloudData = await res.json();
      return cloudData.secure_url || null;
    } catch (err) {
      console.error("Error subiendo imagen a Cloudinary:", err);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!data.nombre || !data.apellido) {
      ErrorAlert("Completa los datos antes de continuar");
      return;
    }

    let carnetImageUrl = null;
    let fotoImageUrl = null;

    // Generar imagen del carnet y subirla
    if (carnetRef.current) {
      const canvas = await html2canvas(carnetRef.current);
      const carnetImageBase64 = canvas.toDataURL();
      carnetImageUrl = await uploadToCloudinary(carnetImageBase64);
    }

    // Subir foto del usuario si existe
    if (data.foto) {
      const fileReader = new FileReader();
      const filePromise = new Promise((resolve) => {
        fileReader.onload = async () => {
          const uploadedUrl = await uploadToCloudinary(fileReader.result);
          resolve(uploadedUrl);
        };
      });
      fileReader.readAsDataURL(data.foto);
      fotoImageUrl = await filePromise;
    }

    const productWithDetails = {
      ...product,
      duaData: {
        ...data,
        carnetImage: carnetImageUrl,
        fotoImage: fotoImageUrl
      },
      customDesign: carnetImageUrl, 
      image: carnetImageUrl 
    };

    SuccessAlert("DUA agregado al carrito");
    addToCart(productWithDetails, 1);
    navigate("/carrito");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setData((prev) => ({ ...prev, foto: file }));
    }
  };

  return (<>
  <div className="camisa-detail-container">
    <div className="camisa-detail-wrapper container">
      {/* Info del producto */}
      <div className="camisa-info-container">
        <div className="camisa-headerg">
          <h1 className="camisa-nameg">{product.name}</h1>
          <span className="camisa-priceg">${parseFloat(product.price).toFixed(2)}</span>
        </div>
        <p className="camisa-description1">{product.description}</p>
      </div>

      {/* Card y formulario */}
      <div className="camisa-content">
        <Card3D data={{ ...data, foto: previewFoto }} ref={carnetRef} />

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input type="text" name="apellido" placeholder="Apellidos" onChange={handleInputChange} />
          <input type="text" name="nombre" placeholder="Nombres" onChange={handleInputChange} />
          <input type="text" name="genero" placeholder="Género" onChange={handleInputChange} />
          <input type="text" name="nacimiento" placeholder="Fecha y lugar de nacimiento" onChange={handleInputChange} />
          <input type="text" name="emergencia" placeholder="En caso de emergencia llamar a" onChange={handleInputChange} />
          <input type="text" name="nacionalidad" placeholder="Nacionalidad" onChange={handleInputChange} />
          <input type="file" accept="image/*" onChange={handleFileChange}/>
          <button type="button" onClick={handleAddToCart}>
            Añadir al carrito
          </button>
        </form>
      </div>
    </div>
  </div>
  </>
  );
};

export default DuasDetail;
