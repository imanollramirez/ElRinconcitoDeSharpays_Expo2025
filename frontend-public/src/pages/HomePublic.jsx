import BannerPrincipal from "../components/bannerPrincipal.jsx";
import CircularGallery from "../components/reactBits/CircularGallery.jsx";
import GradientText from "../components/reactBits/GradientText.jsx";
import TextType from "../components/reactBits/TextType.jsx";
import ScrollFloat from "../components/reactBits/ScrollFloat.jsx";
import ScrollStack, { ScrollStackItem } from "../components/reactBits/ScrollStack.jsx";
import logo1 from "../assets/sharpaysLogo.png";
import logo2 from "../assets/bougies.png";
import logo3 from "../assets/frostyBitesWhite.png";
import logo4 from "../assets/elParaisoDeDios.png";
import logo5 from "../assets/noLosAtropelles.png";
import im1 from "../assets/1.jpeg";
import im2 from "../assets/2.jpeg";
import im3 from "../assets/3.jpeg";
import im4 from "../assets/4.jpeg";
import im5 from "../assets/5.jpeg";

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

        <div className="text-center mt-5">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            color={"#FE3F8D"}
          >
            Conoce Nuestras Tiendas
          </ScrollFloat>

  

  </div>
</div>

<ScrollStack>
  {/* Card 1 */}
  <ScrollStackItem itemClassName="card-variant-1">
    <div className="floating-lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="floating-light"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    <div
      className="stack-card-background"
      style={{ backgroundImage: `url(${im3})` }}
    />

    <div className="stack-overlay-content">
      <div className="stack-header">
        <img src={logo1} alt="Logo" className="stack-logo" />
        <h2>Sharpays Boutique</h2>
      </div>
      <p>
        Este es el primer card con un diseño más minimalista y limpio. Imágenes,
        luces y contenido elegante.
      </p>
    </div>
  </ScrollStackItem>

  {/* Card 2 */}
  <ScrollStackItem itemClassName="card-variant-2">
    <div className="floating-lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="floating-light"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    <div
      className="stack-card-background"
      style={{ backgroundImage: `url(${im2})` }}
    />

    <div className="stack-overlay-content">
      <div className="stack-header">
        <img src={logo2} alt="Logo" className="stack-logo" />
        <h2>Bougies</h2>
      </div>
      <p>Velas artesanales y ambientadores naturales que enamoran los sentidos.</p>
    </div>
  </ScrollStackItem>

  {/* Card 3 */}
  <ScrollStackItem itemClassName="card-variant-3">
    <div className="floating-lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="floating-light"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    <div
      className="stack-card-background"
      style={{ backgroundImage: `url(${im1})` }}
    />

    <div className="stack-overlay-content">
      <div className="stack-header">
        <img src={logo3} alt="Logo" className="stack-logo" />
        <h2>FrostyBites</h2>
      </div>
      <p>Paletas artesanales y postres fríos hechos con amor.</p>
    </div>
  </ScrollStackItem>

  {/* Card 4 */}
  <ScrollStackItem itemClassName="card-variant-4">
    <div className="floating-lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="floating-light"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    <div
      className="stack-card-background"
      style={{ backgroundImage: `url(${im4})` }}
    />

    <div className="stack-overlay-content">
      <div className="stack-header">
        <img src={logo4} alt="Logo" className="stack-logo" />
        <h2>El Paraíso de Dios</h2>
      </div>
      <p>Arreglos florales y detalles que honran el amor eterno.</p>
    </div>
  </ScrollStackItem>

  {/* Card 5 */}
  <ScrollStackItem itemClassName="card-variant-5">
    <div className="floating-lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="floating-light"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    <div
      className="stack-card-background"
      style={{ backgroundImage: `url(${im5})` }}
    />

    <div className="stack-overlay-content">
      <div className="stack-header">
        <img src={logo5} alt="Logo" className="stack-logo" />
        <h2>No los Atropelles</h2>
      </div>
      <p>Concientización, cuidado y protección para los animales callejeros.</p>
    </div>
  </ScrollStackItem>
</ScrollStack>


    
    </>
  );
};
export default HomePublic;
