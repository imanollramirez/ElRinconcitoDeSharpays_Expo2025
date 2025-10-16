import React from "react";
import GradientText from "../components/reactBits/GradientText.jsx";
import { Link } from "react-router-dom";
import CustomButton from "../components/CustomButton.jsx";

const TermsConditions = () => {
    return (
        <>
        <div className="legal-container">
                <Link to={"/elRinconcitoDeSharpays"}>
                    <CustomButton text={"< Regresar"} background={"#fe3f8d"} color={"#ffff"} height={"40px"} width={"100px"} />
                </Link>
            <section className="legal-hero text-center mt-5">
                <GradientText
                    colors={["#FE3F8D", "#ffabce", "#ac3365"]}
                    animationSpeed={6}
                    fontSize={"3.2em"}
                    className="fw-bold"
                >
                    Términos y Condiciones
                </GradientText>
                <p className="mt-2 fw-medium text-muted">
                    Última actualización: Octubre 2025
                </p>
            </section>

            <section className="legal-section">
                <hr />

                <h3>1. Aceptación de los términos</h3>
                <p>
                    Al utilizar <strong>El Rinconcito de Sharpays</strong>, aceptás estos
                    términos y las leyes vigentes en El Salvador. Si no estás de acuerdo,
                    por favor no utilices el sitio.
                </p>

                <h3>2. Uso permitido</h3>
                <p>
                    El usuario se compromete a utilizar el sitio únicamente con fines
                    legítimos. Está prohibido el fraude, el acceso no autorizado, el spam
                    o la copia no autorizada de contenido.
                </p>

                <h3>3. Cuentas de usuario</h3>
                <p>
                    Para comprar o acceder a ciertas funciones, debés crear una cuenta con
                    información veraz. Sos responsable de mantener tu contraseña segura y
                    de cualquier actividad que ocurra bajo tu cuenta.
                </p>

                <h3>4. Compras y pagos</h3>
                <p>
                    Las compras se realizan en dólares estadounidenses (USD) mediante
                    tarjeta de débito o pago en efectivo. Nos reservamos el derecho de
                    corregir errores de precios o disponibilidad y cancelar pedidos si es
                    necesario.
                </p>

                <h3>5. Propiedad intelectual</h3>
                <p>
                    Todo el contenido del sitio (textos, imágenes, logotipos, código y
                    diseño) pertenece a <strong>El Rinconcito de Sharpays</strong> o sus
                    respectivos dueños. No se permite su reproducción sin autorización.
                </p>

                <h3>6. Limitación de responsabilidad</h3>
                <p>
                    No garantizamos la ausencia de errores técnicos o interrupciones. No
                    somos responsables por daños derivados del uso del sitio o de la
                    imposibilidad de acceder a él.
                </p>

                <h3>7. Modificación de términos</h3>
                <p>
                    Podemos actualizar estos términos en cualquier momento. La versión
                    vigente se publicará en esta misma página.
                </p>

                <h3>8. Ley aplicable</h3>
                <p>
                    Este documento se rige por las leyes de <strong>El Salvador</strong>.
                    Cualquier disputa será resuelta por los tribunales competentes del país.
                </p>

                <h3>9. Contacto</h3>
                <p>
                    Para dudas o consultas, comunicate con nosotros al correo:{" "}
                    <a href="mailto:expo.impulsatec.2025@gmail.com" className="link-pink">
                        expo.impulsatec.2025@gmail.com
                    </a>.
                </p>
            </section>
        </div>
        </>
    )
}

export default TermsConditions;