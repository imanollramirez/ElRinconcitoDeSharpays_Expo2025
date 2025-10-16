import { useState } from "react";
import BannerPrincipal from "../components/bannerPrincipal.jsx";
import CircularGallery from "../components/reactBits/CircularGallery.jsx";
import GradientText from "../components/reactBits/GradientText.jsx";
import TextType from "../components/reactBits/TextType.jsx";
import ScrollFloat from "../components/reactBits/ScrollFloat.jsx";
import DomeGallery from "../components/reactBits/DomeGallery.jsx";
import ScrollTrigger from "../components/ScrollTrigger.jsx";
import imagen from "../assets/noLosAtropelles.png";
import "../styles/HomePublic.css";

const HomePublic = () => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      
      text: "La campaña de (No Los Atropelles. Déjaios Cruzar) nació oficialmente el 18 de Septiembre de 2017 en redes sociales, previo a eso comenzó 2 meses antes como un juego y concientización en el parque bicentenario regalando Stickers a todas las personas que llegaban al parque con sus mascotas"
    },
    {
      
      text: "La campaña se fue extendiendo a revel nacional haciende afiliaciones con agentes de la PNC (Policia Nacional Civil) delegación de fronteras, arsa administrativa de la PVC, on la PGR (Procuraduria General de la Repúblicat, Colegio Licen Profesor Ladislan Lelva y refugio CatDog (refugio de perros y gatos)"
    },
    {
      
      text: "La PNC y la PGR son las dos afiliaciones más grandes y fuertes que poseemos en la campaña por lo que muchos vehiculos de la PNC y la PGR cuentan con Stickers de la campaña en sus vehículos oficiales"
    }
  ];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <>
      <div className="main-container">
        <BannerPrincipal />
        <div className="animated-text d-flex justify-content-evenly align-items-center mt-5 mb-5">
          <div className="text-center">
            <p className="fw-bold m-0 fs-5">Pequeños detalles para grandes</p>
            <GradientText
              colors={["#FE3F8D,#ce6f96ff,#c05380ff,#ffabceff, #ac3365ff"]}
              animationSpeed={5}
              showBorder={false}
              className="fw-bold m-0"
              fontSize={"4em"}
            >
              Momentos
            </GradientText>
          </div>

          <div>
            <p className="fs-5" hidden>
              En el rinconcito de Sharpay encuentras regalos unicos: sublimados
              personalizados, <br />
              paletas artesanales, velas, suculentas y mas. Cada compra apoya
              donaciones <br />a perritos en situacion de calle
            </p>

            <TextType
              text={
                "En el rinconcito de Sharpay encuentras regalos unicos: sublimados personalizados,\npaletas artesanales, velas, suculentas y mas. Cada compra apoya donaciones\na perritos en situacion de calle."
              }
              typingSpeed={25}
              pauseDuration={900}
              showCursor={false}
              loop={false}
              cursorCharacter="🐾"
              className="fs-5"
            />
          </div>
        </div>

        <CircularGallery />

        <br />

        <div className="text-center mt-5 mb-5">
          <ScrollFloat
            animationDuration={1.8}
            ease="power3.out"
            scrollStart="top bottom-=20%"
            scrollEnd="bottom top+=20%"
            stagger={0.015}
            color={"#FE3F8D"}
          >
            Conoce Nuestras Tiendas
          </ScrollFloat>
        </div>
      </div>  

      <div>
        <ScrollTrigger/>
      </div>
      <br />
      <br />
      <br />



      <div className="events-header" justifyContent="center">
        <GradientText
              colors={["#FE3F8D,#ce6f96ff,#c05380ff,#ffabceff, #ac3365ff"]}
              animationSpeed={5}
              showBorder={false}
              className="fw-bold m-0"
              fontSize={"4em"}
            >
              Nuestra Historia
            </GradientText>
        <h2>“No Los Atropelles, Déjalos Cruzar"</h2>
      </div>

      

      {/* --- NUEVA SECCIÓN: STEPPER PROFESIONAL --- */}
<div
  className="story-stepper-container mt-1 py-1 d-flex justify-content-center"
  style={{
    width: "100%",
  }}
>
  <div
    className="stepper-box"
    style={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #ffffffff",
      width: "90%",
      minHeight: "400px",
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      position: "relative",
      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    }}
  >
    {/* Imagen de ejemplo, se puede reemplazar */}
    <div
      style={{
        width: "70%",
        height: "70%",
        minHeight: "150px",
        backgroundColor: "#f0f0f0",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={imagen}
        alt="Imagen de la historia"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>

    {/* Contenido del step */}
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <h4 className="fw-bold mb-3" style={{ color: "#FE3F8D" }}>
        {steps[step - 1].title}
      </h4>
      <p style={{ lineHeight: "1.8", fontSize: "1rem", color: "#4a4a4a" }}>
        {steps[step - 1].text}
      </p>

      {/* Stepper indicador */}
      <div className="d-flex align-items-center mt-4">
        {steps.map((_, index) => (
          <div key={index} className="d-flex align-items-center">
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: index + 1 <= step ? "#FE3F8D" : "#dcdcdc",
                transition: "background-color 0.3s ease",
              }}
            ></div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  backgroundColor: index + 1 < step ? "#FE3F8D" : "#dcdcdc",
                  transition: "background-color 0.3s ease",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Botones en la esquina inferior derecha */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="btn px-4 py-2 fw-semibold"
          style={{
            backgroundColor: "#e0e0e0",
            color: "#333",
            borderRadius: "20px",
            border: "none",
          }}
          onClick={prevStep}
          disabled={step === 1}
        >
          Atrás
        </button>

        <button
          className="btn px-4 py-2 fw-semibold"
          style={{
            backgroundColor: "#FE3F8D",
            color: "#fff",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 4px 10px rgba(254,63,141,0.2)",
          }}
          onClick={nextStep}
          disabled={step === steps.length}
        >
          {step === steps.length ? "Fin" : "Siguiente"}
        </button>
      </div>
    </div>
  </div>
  
</div>


    </>
  );
};

export default HomePublic;
