import { useLocation } from "react-router-dom";
//input personalizado para el formulario de login y registro

const CustomInput = ({
  label,
  placeholder,
  type,
  name,
  disable,
  hidden,
  onChange,
  value,
  maxLength
}) => {

  const location = useLocation();

  const whiteLabel = ["/login","/Register","/RecoveryPassword"];

  return (
    <div className="m-2">
      <label htmlFor={name} className={whiteLabel.includes(location.pathname) ? 'text-white' : 'form-label'} hidden={hidden}> {/* White text only for specific pages*/}
        {label}
      </label>
      <div className="mt-2">
        <input
          id={name}
          placeholder={placeholder}
          type={type}
          className="custom-input"
          disabled={disable}
          hidden={hidden}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export default CustomInput;
