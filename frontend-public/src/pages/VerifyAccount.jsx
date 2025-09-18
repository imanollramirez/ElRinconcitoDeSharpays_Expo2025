import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Animations
import ShapesAnimation from "../components/ShapesAnimation.jsx";

// Components
import GlassBox from "../components/GlassBox.jsx";
import LogoLogin from "../components/LogoLogin.jsx";
import CustomTitle from "../components/CustomTitle.jsx";
import CustomInput from "../components/CustomInput.jsx";
import CustomButton from "../components/CustomButton.jsx";
import VerifyAccount from "../components/customer/hook/useDataCustomer.jsx"; // Fixed typo

const VerifyAccountPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { verifyCustomer, resendVerificationCode } = VerifyAccount();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError("Por favor ingrese el código de verificación");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("El código debe tener 6 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyCustomer(verificationCode);
      
      if (result.success) {
        setSuccess("¡Cuenta verificada exitosamente!");
        setTimeout(() => {
          navigate("/dashboard"); // Redirect after successful verification
        }, 2000);
      } else {
        setError(result.message || "Error verificando la cuenta");
      }
    } catch (error) {
      setError("Error de conexión. Por favor intente nuevamente.");
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendVerificationCode();
      
      if (result.success) {
        setSuccess("Código reenviado. Revise su correo electrónico.");
      } else {
        setError(result.message || "Error reenviando el código");
      }
    } catch (error) {
      setError("Error de conexión. Por favor intente nuevamente.");
      console.error("Resend error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    setVerificationCode(value);
    setError(""); // Clear error when user types
  };

  return (
    <div className="recovery-password-container d-flex">
      <div className="lights-background">
        <ShapesAnimation NUM_SHAPES={10} />

        <GlassBox>
          <LogoLogin textStyle="text-white fw-bold fs-5 pt-2 w-50" />

          <div className="recovery-password-content d-flex justify-content-center align-items-center flex-column mt-5 pt-5 w-100 text-white">
            <CustomTitle
              style="text-white fw-bold fs-3 mb-5"
              text="Verificación de cuenta"
            />

            {error && (
              <div className="alert alert-danger w-100 text-center mb-3">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success w-100 text-center mb-3">
                {success}
              </div>
            )}

            <form onSubmit={handleVerify} className="w-100 d-flex flex-column align-items-center">
              <CustomInput
                label="Código de verificación"
                placeholder="A1B2C3"
                type="text"
                maxLength={6}
                name="verifyAccount"
                value={verificationCode}
                onChange={handleCodeChange}
                disabled={isLoading}
              />

              <CustomButton
                text={isLoading ? "Verificando..." : "Verificar"}
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                background="black"
                color="white"
                width="300px"
                height="50px"
              />
            </form>

            <div className="mt-3 text-center">
              <p className="text-white-50">¿No recibiste el código?</p>
              <button
                type="button"
                className="btn btn-link text-white"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                {isLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </div>
        </GlassBox>
      </div>
    </div>
  );
};

export default VerifyAccountPage;