import "../styles/ResetPassword.css";
import { useNavigate } from "react-router-dom";

//Animaciones
import LightsAnimation from "../components/LightsAnimations.jsx"
import ShapesAnimation from "../components/ShapesAnimation.jsx";

//Componentes
import GlassBox from "../components/GlassBox.jsx";
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx";
import CustomButton from "../components/CustomButton.jsx";

const ResetPassword = () => {

     const navigate = useNavigate();

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

                <div className="reset-password-content d-flex justify-content-center align-items-center flex-column mt-4 w-100">
                  <CustomTitle
                    style={"text-white fw-bold fs-3 mb-5"}
                    text={"Restablecer Contraseña"}
                  />

                  <CustomInput
                    label={"Nueva Contraseña"}
                    placeholder={"********"}
                    type={"text"}
                    name={"newPassword"}
                  />

                  <CustomInput
                    label={"Confirmar Contraseña"}
                    placeholder={"********"}
                    type={"text"}
                    name={"confirmPassword"}
                  />
                  <div style={{ width: "300px", marginTop: "30px" }}>
                    <CustomButton
                      text={"Restablecer"}
                      action={(e) => navigate("/ResetPassword")}
                      background={"black"}
                      color={"white"}
                      width={"100%"}
                      height={"50px"}
                    />
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