import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GlassBox from "../components/GlassBox.jsx";

//Animaciones
import LightsAnimation from "../components/LightsAnimations.jsx";

//Componentes utilizados en el login-container
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx";
import LinkText from "../components/LinkText.jsx";
import CustomButton from "../components/CustomButton.jsx";

//Imágenes
import huella from "../assets/huella.png";
import cactus from "../assets/cactus.png";
import vela from "../assets/vela.png";
import paleta from "../assets/paleta.png";

//AuthContext
import { useAuth } from "../context/AuthContext.jsx";

//Alertas
import ErrorAlert from "../components/ErrorAlert.jsx";
import SuccessAlert from "../components/SuccessAlert.jsx";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0); //  Intentos fallidos
  const { login, authCookie } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      ErrorAlert(
        `Tu cuenta está bloqueada. Tiempo restante: ${Math.ceil(
          blockTimeRemaining / 60
        )} minutos.`
      );
      return;
    }

    if (!email || !password) {
      ErrorAlert("Por favor, completa todos los campos.");
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setFailedAttempts((prev) => prev + 1);

      if (failedAttempts + 1 >= 3) {
        //Bloquear después de 3 intentos fallidos
        ErrorAlert(
          "Tu cuenta ha sido bloqueada por 1 minuto debido a múltiples intentos fallidos."
        );
        setIsBlocked(true);
        setBlockTimeRemaining(60); // 1 minuto en segundos
        setFailedAttempts(0); // Reiniciar contador
        setPassword("");

        // ⏳ Iniciar temporizador
        const interval = setInterval(() => {
          setBlockTimeRemaining((prev) => {
            if (prev <= 1) {
              setIsBlocked(false);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return;
      }
      setPassword("");
      return;
    }
    SuccessAlert("Sesión iniciada con éxito");
    setFailedAttempts(0); 
  };

  useEffect(() => {
    if (authCookie) {
      navigate("/Dashboard");
    }
  }, [authCookie]);

  return (
    <>
      <div className="login-container d-flex">
        <div className="lights-background">
          <img src={huella} className="float huella" />
          <img src={paleta} className="float paleta" />
          <img src={vela} className="float vela" />
          <img src={cactus} className="float cactus" />

          <LightsAnimation NUM_LIGHTS={50} />

          <GlassBox>
            <>
              <LogoLogin textStyle={"text-white fw-bold fs-5 pt-2 w-50"} />

              <form
                className="login-content d-flex justify-content-center align-items-center flex-column mt-4 w-100"
                onSubmit={handleSubmit}
              >
                <CustomTitle
                  style={"text-white fw-bold fs-2 mb-5"}
                  text={"Iniciar sesión"}
                />

                <CustomInput
                  label={"Correo electrónico"}
                  placeholder={"Ejemplo@gmail.com"}
                  onChange={(e) => setEmail(e.target.value)}
                  type={"email"}
                  name={"email"}
                  value={email}
                  disabled={isBlocked}
                />

                <CustomInput
                  label={"Contraseña"}
                  placeholder={"********"}
                  onChange={(e) => setPassword(e.target.value)}
                  type={"password"}
                  name={"password"}
                  value={password}
                  disabled={isBlocked}
                />
                <div style={{ width: "280px", marginTop: "5px" }}>
                  <LinkText
                    text={"Olvidé mi contraseña"}
                    action={"/RecoveryPassword"}
                  />

                  <CustomButton
                    text={
                      isBlocked
                        ? `Bloqueada (${Math.ceil(blockTimeRemaining / 60)}min)`
                        : "Iniciar sesión"
                    }
                    background={isBlocked ? "gray" : "black"}
                    color={"white"}
                    width={"100%"}
                    height={"50px"}
                    disabled={isBlocked}
                  />
                </div>
              </form>
            </>
          </GlassBox>
        </div>
      </div>
    </>
  );
};

export default Login;








