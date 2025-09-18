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
  const { setVerificationCode, verificationCode, verifyCustomer } = VerifyAccount();

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    setVerificationCode(value);
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

            <CustomInput
              label="Código de verificación"
              placeholder="A1B2C3"
              type="text"
              maxLength={6}
              name="verifyAccount"
              value={verificationCode}
              onChange={handleCodeChange}
            />

            <CustomButton
              text="Verificar"
              onClick={async (e) => { verifyCustomer(e) }}
              background="black"
              color="white"
              width="300px"
              height="50px"
            />
          </div>
        </GlassBox>
      </div>
    </div>
  );
};

export default VerifyAccountPage;