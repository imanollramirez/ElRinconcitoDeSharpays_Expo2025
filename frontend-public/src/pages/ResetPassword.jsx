import "../styles/ResetPassword.css";
import { useEffect } from "react";
import LinkText from "../components/LinkText.jsx";

//Animaciones
import LightsAnimation from "../components/LightsAnimations.jsx"
import ShapesAnimation from "../components/ShapesAnimation.jsx";

//Componentes
import GlassBox from "../components/GlassBox.jsx";
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx";
import CustomButton from "../components/CustomButton.jsx";

import useRecoveryPassword from "../hook/useRecoveryPassword.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import useDataCustomer from "../components/customer/hook/useDataCustomer";

const ResetPassword = () => {

  const { user } = useAuth();
  const data = useDataCustomer();

  const {
    updatePassword,
    setEmail,
    email,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
  } = useRecoveryPassword();

  useEffect(() => {
    if (user?.id) {
      data.fetchCustomerById(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (data.email) {
      setEmail(data.email);
    }
  }, [data.email]);


    return (
      <>
        <div className="reset-password-container d-flex">
        <div className="lights-background">

           <LightsAnimation
          NUM_LIGHTS={50}
          />
           
           <ShapesAnimation
           NUM_SHAPES={10}/>

          <GlassBox>
            {
              <>
                <LogoLogin textStyle={"text-white fw-bold fs-5 pt-2 w-50"} />

                <div className="reset-password-content d-flex justify-content-center align-items-center flex-column mt-4 w-100 text-white">
                  <CustomTitle
                    style={"text-white fw-bold fs-3 mb-5"}
                    text={"Actualizar Contraseña"}
                  />

                  <CustomInput
                    label={"Nueva Contraseña"}
                    placeholder={"********"}
                    type={"password"}
                    name={"newPassword"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <CustomInput
                    label={"Confirmar Contraseña"}
                    placeholder={"********"}
                    type={"password"}
                    name={"confirmPassword"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div style={{ width: "300px", marginTop: "30px" }}>
                    <CustomButton
                      text={"Restablecer"}
                      background={"black"}
                      color={"white"}
                      width={"100%"}
                      height={"50px"}
                      onClick={updatePassword}
                    />
                  </div>
                   <div style={{ marginTop: "30px" }}>
                  <LinkText text={"Regresar"} action={"/profile"}/>
                   </div>
                </div>
              </>
            }
          </GlassBox>
        </div>
      </div>
        </>
    );
};

export default ResetPassword;