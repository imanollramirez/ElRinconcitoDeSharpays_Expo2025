import React from 'react';
import RotatingText from '../components/reactBits/RotatingText';
import ShinyText from '../components/reactBits/ShinyText';
import '../styles/Duas.css';
import duaImage from '../assets/duasPage.png'
import { useNavigate } from 'react-router-dom';



const MyLandingPage = () => {
    const navigate = useNavigate();

  const handleIrProducto = () => {
     navigate("/duas/6894e2d31b606ed1c1f6039e");
  };
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Texto (70%) */}
        <div className="landing-text">
          <h1 className="landing-title">
            La identidad{" "}
            <span className="highlighted-rotating-text">
              <RotatingText
                texts={['única', 'divertida', 'adorable', 'oficial', 'cool']}
                mainClassName="inline-block text-white overflow-hidden"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </span>{" "}
             <br />
            para tu perrito
          </h1>

          <p className="landing-paragraph">
            Compra ya tu DUA, hazlo parte de tu familia con estilo y apoya una buena causa 💖
          </p>

           <button onClick={handleIrProducto}  className="buy-button">
            <ShinyText text="Compralo ahora!" disabled={false} speed={3} className='custom-class' />
          </button>
         
        </div>

        {/* Imagen (30%) */}
        <div className="landing-image">
          <img
            src={duaImage}
            alt="DUA perrito"
            className="image-dog"
          />
        </div>
      </div>
    </div>
  );
};

export default MyLandingPage;