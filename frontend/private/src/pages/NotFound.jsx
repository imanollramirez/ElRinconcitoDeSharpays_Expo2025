import SpaceOtto from "../assets/otto.png"; // Imagen principal de Otto en el espacio
import Saturn from "../assets/saturn_purple.png"; // Imagen de Saturno en color morado
import PlaneBlue from "../assets/Planet_blue.png"; // Imagen de planeta azul
import Bone from "../assets/Bone.png"; // Imagen de hueso
import Sat from "../assets/Sat.png"; // Imagen de satélite
import PlanetYellow from "../assets/Smallplanet_yellow.png"; // Imagen de planeta amarillo
import "../styles/NotFound.css"; // Estilos propios de la página NotFound

import CustomButton from "../components/CustomButton.jsx"; // Botón personalizado
import { Link } from "react-router-dom"; // Enlace de React Router para navegación

import LightsAnimation from "../components/LightsAnimations.jsx"; // Animación de luces de fondo

const NotFound = () => {
  return (
    <>
      <div className="lights-background"> {/* Fondo con animación de luces */}
        <LightsAnimation NUM_LIGHTS={50}/> {/* Componente que genera 50 luces animadas */}
        
        <div className="container not-found-main">
          <div className="container-inner text-center">
            
            {/* Mensaje de error principal */}
            <div className="text-center">
              <h1 className="fw-bold mt-5 pt-5 text-white" style={{ fontSize: "4em" }}>
                Página no encontrada
              </h1>
            </div>

            {/* Sección con imágenes decorativas del error */}
            <div className="not-found">
              <img
                alt=""
                className="not-found-image space-otto"
                src={SpaceOtto}
              />
              <img
                alt=""
                className="not-found-image saturn-purple"
                src={Saturn}
              />
              <img
                alt=""
                className="not-found-image planet-blue"
                src={PlaneBlue}
              />
              <img className="not-found-image bone" src={Bone} />
              <img alt="" className="not-found-image sat" src={Sat} />
              <img
                alt=""
                className="not-found-image planet-yellow"
                src={PlanetYellow}
              />
            </div>

            {/* Botón para regresar al Dashboard */}
            <Link to={"/Dashboard"}>
              <CustomButton
                text={"Regresar"}
                background={"#ffffffff"}
                color={"black"}
                width={"120px"}
                height={"50px"}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound; 
