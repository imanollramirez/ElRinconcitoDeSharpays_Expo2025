import { Link } from "react-router-dom";
// Componente para enlaces estilizados
const LinkText = ({text, action}) => {
    return (
        <>
        <Link to={action} className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{text}</Link>
        </>
    );
};

export default LinkText;