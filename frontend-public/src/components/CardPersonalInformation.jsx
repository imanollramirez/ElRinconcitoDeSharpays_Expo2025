import React, { useState, useEffect } from 'react';
import InputText from "../components/CustomInput";
import Button from "../components/CustomButton";
import '../styles/CardPersonalInformation.css';
import { useAuth } from "../context/AuthContext.jsx";
import useDataCustomer from "../components/customer/hook/useDataCustomer";

import { Link } from 'react-router-dom';

import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const CardPersonalInformation = () => {
  const { user } = useAuth();
  const data = useDataCustomer();

  console.log(data, "valor de data")

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (user?.id) {
      data.fetchCustomerById(user?.id);
    }
  }, [user?.id]);

  const toggleEdit = async () => {
    if (isEditable) {
      SuccessAlert("Edita tu información");

      try {
        await data.updateCustomer(user?.id);
        SuccessAlert("Perfil actualizado exitosamente");
        setIsEditable(false);
      } catch (error) {
        ErrorAlert("Error al actualizar el perfil");
      }
    } else {
      SuccessAlert("Ahora puedes editar tus datos");
      setIsEditable(true);
    }
  };

  return (
    <div className="personal-info-card">
      <div className="personal-info-header">
        <span className="personal-info-title">Información Personal</span>
      </div>

      <div className="personal-info-row">
        <div className="personal-info-inputs">
          <InputText
            value={data.name}
            onChange={(e) => data.setName(e.target.value)}
            className="info-input"
            disable={!isEditable}
          />
          <InputText
            value={data.email}
            onChange={(e) => data.setEmail(e.target.value)}
            className="info-input"
            disable={!isEditable}
          />
        </div>

        <div className="d-flex justify-content-start personal-info-card-btn" style={{ gap: 20 }}>
          <Button
            text={isEditable ? "Guardar" : "Editar"}
            className="edit-btn"
            onClick={toggleEdit}
            background="#ff6daa"
            height={50}
            width={100}
            color="white"
          />
          <Link to={"/updatePassword"}>
          <Button
            text="Cambiar Contraseña"
            className="password-btn"
            background="#ff6daa"
            height={50}
            width={200}
            color="white"
          />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPersonalInformation;
