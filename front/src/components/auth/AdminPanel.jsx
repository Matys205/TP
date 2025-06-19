import React, { useState } from "react";
import AgregarEvento from "../eventos/agregarevento/agregarEvento";

const AdminPanel = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleEventoAgregado = (nuevoEvento) => {
    setMensaje("✅ Evento agregado correctamente.");
    setMostrarFormulario(false);
    setTimeout(() => setMensaje(""), 3000);
    // Aquí podrías actualizar una lista de eventos si la tienes.
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4">Panel de Administrador</h2>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? "Ocultar formulario" : "Agregar nuevo evento"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="d-flex justify-content-center">
          <AgregarEvento OnEventoAdded={handleEventoAgregado} />
        </div>
      )}

      {/* Aquí puedes agregar más herramientas administrativas en el futuro */}
    </div>
  );
};

export default AdminPanel;