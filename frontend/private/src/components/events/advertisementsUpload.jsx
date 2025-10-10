import React, { useState, useEffect } from "react";
import UploadImage from "../ProductsImage";
import ImagePreview from "../ImagePreview";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { Subtitle } from "../Typography";
import "../../styles/AdvertisementsUploads.css";

const AdvertisementsUpload = ({
  tittle, setTittle,
  description, setDescription,
  image, setImage,
  isEditing,
  handleSubmit,
  handleUpdate
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (image) {
      setImageUrl(image);
    }
  }, [image]);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl]);

  const isOnlyWhitespace = (text) => !text || !text.replace(/\s/g, '').length;

  const validateFields = () => {
    const newErrors = {};

    if (isOnlyWhitespace(tittle)) {
      newErrors.tittle = "El título no puede estar vacío";
    }

    if (isOnlyWhitespace(description)) {
      newErrors.description = "La descripción no puede estar vacía";
    } else if (description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres.";
    } else if (tittle.trim().length < 3) {
      newErrors.description = "El título debe tener al menos 10 caracteres.";
    }


    if (!imageUrl) {
      newErrors.image = "La imagen es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    isEditing ? handleUpdate(e) : handleSubmit(e);
  };

  return (
    <div>
      <div className="main-container d-flex">
        <div className="upload-box">
          <UploadImage
            onUpload={(url) => {
              setImageUrl(url);
              setImage(url);
            }}
          />
          {errors.image && (
            <p className="text-danger mt-1" style={{ fontSize: "14px" }}>{errors.image}</p>
          )}
        </div>
        <div className="preview-box">
          <ImagePreview imageUrl={imageUrl} />
        </div>
      </div>

      <form
        className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md p-8"
        onSubmit={onSubmit}
      >
        <div className="form-row mt-4">
          <div className="input-titulo">
            <label className="form-label">Título del evento</label>
            <CustomInput
              placeholder="Título"
              type="text"
              name="tittle"
              value={tittle}
              onChange={(e) => setTittle(e.target.value)}
            />
            {errors.tittle && (
              <p className="text-danger mt-1" style={{ fontSize: "14px" }}>{errors.tittle}</p>
            )}
          </div>
          <div className="input-descripcion mt-4">
            <label className="form-label">Descripción del evento</label>
            <CustomInput
              placeholder="Descripción"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-danger mt-1" style={{ fontSize: "14px" }}>{errors.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <CustomButton
            text={isEditing ? "Actualizar" : "Agregar"}
            background={isEditing ? "#FD0053" : "black"}
            color="white"
            width="180px"
            height="50px"
            border="none"
          />
        </div>
      </form>
    </div>
  );
};

export default AdvertisementsUpload;
