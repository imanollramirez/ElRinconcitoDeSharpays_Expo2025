import "../styles/RecoveryPassword.css";
import { useState } from "react";

// Animaciones
import LightsAnimation from "../components/LightsAnimations.jsx";
import ShapesAnimation from "../components/ShapesAnimation.jsx";

// Componentes
import GlassBox from "../components/GlassBox.jsx";
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx";
import LinkText from "../components/LinkText.jsx";
import CustomButton from "../components/CustomButton.jsx";
import useRecoveryPassword from "../hook/useRecoveryPassword.jsx";

const RecoveryPassword = () => {

  const {
    sendCode,
    verifyCode,
    resetPassword,
    setEmail,
    email,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
  } = useRecoveryPassword();

  const [step, setStep] = useState(1); // 1: Envio de código → 2: Verificación código → 3: Nueva contraseña

  return (
    <div className="recovery-password-container d-flex">
      <div className="lights-background">
        <LightsAnimation NUM_LIGHTS={80} />
        <ShapesAnimation NUM_SHAPES={10} />

        <GlassBox>
          <LogoLogin textStyle="text-white fw-bold fs-5 pt-2 w-50" />

          <div className="recovery-password-content d-flex justify-content-center align-items-center flex-column mt-5 pt-3 w-100">
            <CustomTitle
              style="text-white fw-bold fs-3 mb-5"
              text="Recuperación de Contraseña"
            />

            {step === 1 && (
              <>
                <CustomInput
                  label="Correo Electrónico"
                  placeholder="Ejemplo@gmail.com"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <CustomButton
                  text="Enviar Código"
                  onClick={async (e) => {
                    const success = await sendCode(e);
                    if (success) {
                      setStep(2);
                    }

                  }}
                  background="black"
                  color="white"
                  width="300px"
                  height="50px"
                />

                <div className="go-to-register text-center mt-5 pt-5 d-flex">
                  <LinkText text="Iniciar Sesión" action="/login" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-white text-center">
                  Ingrese el código que se envió a su <br />
                  <b>correo electrónico</b>
                </p>

                <CustomInput
                  label="Código de Verificación"
                  placeholder="000000"
                  type="number"
                  name="code"
                  maxLength={5}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <CustomButton
                  text="Verificar Código"
                  onClick={async (e) => {
                    const success = await verifyCode(e);
                    if (success) {
                      setStep(3);
                    }
                  }
                  }
                  background="black"
                  color="white"
                  width="300px"
                  height="50px"
                />
              </>
            )}

            {step === 3 && (
              <>
                <CustomInput
                  label="Nueva Contraseña"
                  placeholder="********"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <CustomInput
                  label="Confirmar Contraseña"
                  placeholder="********"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <CustomButton
                  text="Restablecer Contraseña"
                  onClick={resetPassword}
                  background="black"
                  color="white"
                  width="300px"
                  height="50px"
                />
              </>
            )}
          </div>
        </GlassBox>
      </div>
    </div>
  );
};

export default RecoveryPassword;
