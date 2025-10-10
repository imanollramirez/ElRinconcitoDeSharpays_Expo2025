import Swal from "sweetalert2";
// Componente para mostrar alertas de éxito con SweetAlert2
// Utilizado para notificar al usuario sobre acciones exitosas
const SuccessAlert = (title) => {
  return Swal.fire({
    icon: "success",
    title: title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export default SuccessAlert;
