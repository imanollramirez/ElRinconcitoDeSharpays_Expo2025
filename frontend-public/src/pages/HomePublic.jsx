import BannerPrincipal from "../components/bannerPrincipal.jsx";
import CircularGallery from "../components/reactBits/CircularGallery.jsx";
import GradientText from "../components/reactBits/GradientText.jsx";
import TextType from "../components/reactBits/TextType.jsx";
import ScrollFloat from "../components/reactBits/ScrollFloat.jsx";
import ScrollTrigger from "../components/ScrollTrigger.jsx";

const HomePublic = () => {
  return (
    <>
      <div className="main-container">
        <BannerPrincipal />
        <div className="d-flex justify-content-evenly align-items-center mt-5 mb-5">
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
    </>
  );
};
export default HomePublic;