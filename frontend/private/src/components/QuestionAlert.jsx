import Swal from "sweetalert2";

// Componente para mostrar alertas de confirmación con SweetAlert2
// Utilizado para preguntas que requieren confirmación del usuario
const QuestionAlert = (title) => {
  return Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button'
        },
        buttonsStyling: false
      });
};

export default QuestionAlert;
