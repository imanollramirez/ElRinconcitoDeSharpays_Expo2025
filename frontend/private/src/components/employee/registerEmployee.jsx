import React, { useState } from "react";
import InputText from "../CustomInput";
import Button from "../CustomButton";
import UploadImage from "../UploadImage";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";
import QuestionAlert from "../QuestionAlert";
import { useNavigate } from "react-router-dom";

const EmployeeForm = ({
  id,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  imageUrl,
  setImageUrl,
  saveEmployee,
  handleEdit,
  fromProfile = false,
}) => {
  const [enableInput, setEnableInput] = useState(fromProfile);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!email) newErrors.email = "El correo es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Correo inválido.";

    if (!id && !password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (!id && password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleData = async () => {
    const isValid = validateForm();
    if (!isValid) {
      ErrorAlert("Corrige los errores del formulario.");
      return;
    }

    const employeeData = { id, name, email, password, imageUrl };

    try {
      if (id && fromProfile) {
        await handleEdit(employeeData);
        SuccessAlert("Perfil actualizado exitosamente");
        navigate("/Dashboard");
      } else if (id) {
        await handleEdit(employeeData);
        SuccessAlert("Usuario actualizado exitosamente");
      } else {
        await saveEmployee(employeeData);
        SuccessAlert("Usuario registrado exitosamente");
      }
    } catch (err) {
      ErrorAlert("Ocurrió un error inesperado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fromProfile) {
      if (enableInput) {
        const result = await QuestionAlert("¿Deseas editar tu perfil?");
        if (result.isConfirmed) {
          SuccessAlert("Ahora puedes editar tus datos");
          setEnableInput(false);
        }
        return;
      }

      await handleData();
      setEnableInput(true);
    } else {
      await handleData();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-row-wrapper">
        {/* Columna de imagen */}
        <div className="image-upload-section">
          <UploadImage
            onUpload={setImageUrl}
            defaultImage={typeof imageUrl === "string" ? imageUrl : undefined}
            fromProfile={enableInput}
          />
        </div>

        {/* Sección de campos con layout en grid */}
        <div className="fields-section">
          <div className="form-group">
            <InputText
              label={"Nombre"}
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[0-9]/g, ""); // Elimina números
                setName(onlyLetters);
              }}
              disable={enableInput}
            />
            {errors.name && <p style={{ color: "pink" }}>{errors.name}</p>}
          </div>

          <div className="form-group">
            <InputText
              label={"Correo"}
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disable={enableInput}
            />
            {errors.email && <p style={{ color: "pink" }}>{errors.email}</p>}
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <InputText
              label={"Contraseña"}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disable={enableInput}
            />
            {!id && errors.password && (
              <p style={{ color: "pink" }}>{errors.password}</p>
            )}

            {!id && !enableInput && password.length > 0 && (
              <div
                style={{
                  backgroundColor:
                    /[A-Z]/.test(password) &&
                      /[a-z]/.test(password) &&
                      /\d/.test(password) &&
                      password.length >= 8
                      ? "#d4edda" // verde
                      : password.length >= 6
                        ? "#fff3cd" // amarillo
                        : "#f8d7da", // rojo
                  color:
                    /[A-Z]/.test(password) &&
                      /[a-z]/.test(password) &&
                      /\d/.test(password) &&
                      password.length >= 8
                      ? "#155724"
                      : password.length >= 6
                        ? "#856404"
                        : "#721c24",
                  padding: "8px",
                  borderRadius: "6px",
                  marginTop: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                <p>
                  {/[A-Z]/.test(password) ? "✔️" : "❌"} Al menos una mayúscula
                </p>
                <p>
                  {/[a-z]/.test(password) ? "✔️" : "❌"} Al menos una minúscula
                </p>
                <p>{/\d/.test(password) ? "✔️" : "❌"} Al menos un número</p>
                <p>
                  {password.length >= 8 ? "✔️" : "❌"} Mínimo 8 caracteres
                </p>
              </div>
            )}
          </div>


          <div
            className="submit-btn-container"
            style={{ gridColumn: "span 2", display: "flex", gap: "16px" }}
          >
            <Button
              type="submit"
              text={id ? "Actualizar" : "Agregar"}
              background="#FD0053"
              color="white"
              height="48px"
              width="160px"
              fontSize="16px"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
