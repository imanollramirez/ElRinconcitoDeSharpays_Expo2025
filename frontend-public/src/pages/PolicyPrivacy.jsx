import React from "react";
import GradientText from "../components/reactBits/GradientText.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { Link } from "react-router-dom";

const PolicyPrivacy = () => {

    return (
    <>
      <div className="legal-container">
        <Link to={"/elRinconcitoDeSharpays"}>
      <CustomButton text={"< Regresar"} background={"#fe3f8d"} color={"#ffff"} height={"40px"} width={"100px"}/>
        </Link>
      <section className="legal-hero text-center mt-5">
        <GradientText
          colors={["#FE3F8D", "#ffabce", "#ac3365"]}
          animationSpeed={6}
          fontSize={"3.2em"}
          className="fw-bold"
        >
          Políticas de Privacidad
        </GradientText>
        <p className="mt-2 fw-medium text-muted">
          Última actualización: Octubre 2025
        </p>
      </section>

      <section className="legal-section">
        <hr />

        <p>
          En <strong>El Rinconcito de Sharpays</strong> valoramos tu privacidad
          y nos comprometemos a proteger tus datos personales. Esta política
          explica cómo recopilamos, utilizamos y resguardamos tu información.
        </p>

        <h3>1. Responsable del tratamiento</h3>
        <p>
          El responsable de los datos es <strong>El Rinconcito de Sharpays</strong>,
          con sede en El Salvador. Podés contactarnos al correo:{" "}
          <a href="mailto:expo.impulsatec.2025@gmail.com" className="link-pink">
            expo.impulsatec.2025@gmail.com
          </a>.
        </p>

        <h3>2. Datos que recopilamos</h3>
        <ul>
          <li>Nombre, correo electrónico y teléfono.</li>
          <li>Cookies para autenticación (<code>authToken</code>).</li>
          <li>
            Datos almacenados localmente (<code>shoppingcart</code> y{" "}
            <code>token</code>).
          </li>
          <li>Datos de pago: débito o efectivo.</li>
        </ul>

        <h3>3. Cómo se recopilan</h3>
        <p>
          La información se obtiene mediante formularios y cookies esenciales
          para el funcionamiento del sitio. No usamos herramientas de análisis ni
          publicidad de terceros.
        </p>

        <h3>4. Uso de la información</h3>
        <p>
          Utilizamos tus datos para procesar pedidos, mantener tu cuenta activa
          y coordinar entregas con servicios de terceros.
        </p>

        <h3>5. Con quién compartimos los datos</h3>
        <p>
          Solo con nuestro servidor y servicios de entrega necesarios para
          completar tus pedidos. No vendemos ni compartimos tus datos con
          terceros con fines publicitarios.
        </p>

        <h3>6. Derechos del usuario</h3>
        <p>
          Podés editar tu información de perfil, contraseña y contenido del
          carrito de compras. Si deseás eliminar tu cuenta o tus datos, escribinos
          a{" "}
          <a href="mailto:expo.impulsatec.2025@gmail.com" className="link-pink">
            expo.impulsatec.2025@gmail.com
          </a>.
        </p>

        <h3>7. Seguridad de la información</h3>
        <p>
          Implementamos medidas de seguridad razonables, aunque ninguna
          plataforma es totalmente inmune a vulneraciones.
        </p>

        <h3>8. Restricción para menores</h3>
        <p>
          Este sitio no está dirigido a menores de edad, ya que las compras
          requieren datos personales y métodos de pago.
        </p>

        <h3>9. Cambios en esta política</h3>
        <p>
          Nos reservamos el derecho de actualizar esta política en cualquier
          momento. Los cambios se publicarán aquí con su fecha de revisión.
        </p>
      </section>
    </div>
    </>
  );
}

export default PolicyPrivacy;