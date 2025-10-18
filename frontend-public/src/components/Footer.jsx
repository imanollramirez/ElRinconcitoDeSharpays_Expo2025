import LogoLogin from "./LogoLogin";
import LinkText from "./LinkText";

const Footer = () => {
    return (
        <>
            <div className="footer p-4">
                    <LogoLogin textStyle={"text-white fw-bold fs-5 w-50 text-start p-0 m-0"}/>    

                    <div className="d-flex justify-content-center fs-4 m-2">
                        <button><a href="https://www.instagram.com/elrinconcitodesharpay?igsh=MWVxMnd3MnRmbzAzMA==" target="_blank"><i className="fa-brands fa-instagram"></i></a></button>
                        <button><a href="https://www.instagram.com/elrinconcitodesharpay?igsh=MWVxMnd3MnRmbzAzMA==" target="_blank"><i className="fa-brands fa-facebook"></i></a></button>
                        <button><a href="https://www.instagram.com/elrinconcitodesharpay?igsh=MWVxMnd3MnRmbzAzMA==" target="_blank"><i className="fa-brands fa-tiktok"></i></a></button>
                    </div>
                    <div><LinkText action={"/policy&privacy"} text={"Política de Privacidad"}/><span> | </span><LinkText action={"/terms&conditions"} text={"Términos y condiciones"}/></div>
            </div>
        </>
    );
};

export default Footer