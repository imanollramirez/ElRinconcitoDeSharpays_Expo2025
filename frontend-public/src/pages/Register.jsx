import "../styles/Register.css"
import { useNavigate } from "react-router-dom";
import GlassBox from "../components/GlassBox.jsx";

//Animaciones
import LightsAnimation from "../components/LightsAnimations.jsx"

//Componentes utilizados en el login-container
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx"
import LinkText from "../components/LinkText.jsx";
import CustomButton from "../components/CustomButton.jsx";

//Imágenes
import huella from "../assets/huella.png";
import cactus from "../assets/cactus.png";
import vela from "../assets/vela.png";
import paleta from "../assets/paleta.png";
import CustomSelect from "../components/CustomSelect.jsx";

//Departementos API
import Departments from "../utils/apiDepartmentsSV.jsx"
import useRegisterCustomer from "../components/customer/hook/useDataCustomer.jsx";
import { useState } from "react";

import ErrorAlert from "../components/ErrorAlert.jsx";
import SuccessAlert from "../components/SuccessAlert.jsx";

const Register = () => {

  const depa = Departments();
  const navigate = useNavigate();
  const {registerCustomer} = useRegisterCustomer();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      ErrorAlert("Todos los campos son obligatorios");
    } else if (name.length <= 2) {
      ErrorAlert("El nombre es muy corto");
    } else if (password.length <= 8) {
      ErrorAlert("La contraseña debe ser mínimo de 8 carácteres");
    } else {
      const success = await registerCustomer({ name, email, password, department });
      if (success) {
        SuccessAlert("Registro exitoso, verifique su correo.");
        navigate("/verifyAccount");
      }
    }
  };

  return (
    <>
      <div className="register-container d-flex">
        <div className="lights-background">
          <img src={huella} className="float huella" />
          <img src={paleta} className="float paleta" />
          <img src={vela} className="float vela" />
          <img src={cactus} className="float cactus" />

          <LightsAnimation
            NUM_LIGHTS={80}
          />

          <GlassBox>
            {
              <>
                <LogoLogin textStyle={"text-white fw-bold fs-5 pt-2 w-50"} />

                <form className="register-content d-flex justify-content-center align-items-center flex-column mt-5 pt-4 w-100" onSubmit={handleSubmit}>

                  <CustomInput
                    label={"Nombre"}
                    placeholder={"Nombre completo"}
                    name={"name"}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <CustomInput
                    label={"Correo electrónico"}
                    placeholder={"ejemplo@gmail.com"}
                    type={"email"}
                    name={"email"}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <CustomSelect
                    name={"Departamento"}
                    departmens={depa}
                    onChange={(e) => {
                      const selected = depa.find((d) => d.value === e.target.value);
                      setDepartment(selected?.label);
                    }}
                  />

                  <CustomInput
                    label={"Contraseña"}
                    placeholder={"Contraseña"}
                    name={"password"}
                    type={"password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div style={{ width: '300px', marginTop: '30px' }}>
                    <CustomButton
                      text={"Registrarme"}
                      background={"black"}
                      color={"white"}
                      width={"100%"}
                      height={"50px"}
                    />
                  </div>

                  <div className="go-to-register text-center mt-1 pt-4 d-flex">
                    <LinkText
                      text={"Iniciar sesión"}
                      action={"/login"}
                    />
                  </div>

                </form>
              </>
            }
          </GlassBox>
        </div>
      </div>
    </>
  )
}

export default Register;
