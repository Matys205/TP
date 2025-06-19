import { Card, Button, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/carritoContext/CarritoContext";
import { useSesion } from "../../../contexts/sesionContext/SesionContext";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { useState } from "react";

const CardEventos = ({
  idEvento,
  nombreEvento,
  horarioEvento,
  fechaEvento,
  imagenEvento,
  descripcion,
  lugarEvento,
  precioEvento,
  disponible,
  onVerMas,
  onEliminar,
}) => {
  const navigate = useNavigate();
  const { agregarCarrito } = useCart();
  const { usuario } = useSesion();
  const [agregado, setAgregado] = useState(false);

  const handleAgregarCarrito = () => {
    agregarCarrito({
      id: idEvento,
      nombre: nombreEvento,
      precio: precioEvento,
      imagen: imagenEvento,
      fechaEvento,
      horarioEvento,
      lugarEvento,
      disponible,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  const puedeEliminar =
    usuario && (usuario.role === "admin" || usuario.role === "super_admin");

  return (
    <Card
      className="card-evento"
      style={{
        maxWidth: "360px",
        minHeight: "450px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        borderRadius: "20px",
        backgroundColor: "#1e1e1e",
        color: "#f0f0f0",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "6px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/evento/${idEvento}`)}
    >
      {puedeEliminar && onEliminar && (
        <Button
          variant="danger"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          style={{ borderRadius: "50%", width: 32, height: 32, padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onEliminar();
          }}
          title="Eliminar evento"
        >
          ×
        </Button>
      )}

      <Card.Img
        variant="top"
        src={imagenEvento || "https://via.placeholder.com/350x220?text=Sin+Imagen"}
        alt={`Imagen del evento ${nombreEvento}`}
        style={{
          height: "220px",
          objectFit: "cover",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      />

      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title className="mb-2 text-white" style={{ fontWeight: "600" }}>
          {nombreEvento}
        </Card.Title>
        <Card.Text className="mb-3" style={{ fontSize: "0.97rem" }}>
          <div><strong>Fecha:</strong> {fechaEvento}</div>
          <div><strong>Horario:</strong> {horarioEvento}</div>
          <div><strong>Lugar:</strong> {lugarEvento}</div>
          <div><strong>Precio:</strong> ${precioEvento}</div>
        </Card.Text>

        <div className="d-flex gap-2 mt-auto">
          

          {disponible ? (
            <Button
              variant={agregado ? "success" : "light"}
              size="sm"
              className="flex-fill"
              onClick={(e) => {
                e.stopPropagation();
                handleAgregarCarrito();
              }}
              disabled={agregado}
              aria-label="Agregar al carrito"
            >
              <FaShoppingCart className="me-2" />
              {agregado ? "Agregado!" : "COMPRAR"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="flex-fill"
              disabled
              aria-label="Evento no disponible"
              onClick={(e) => e.stopPropagation()}
            >
              No disponible
            </Button>
          )}
          
        </div>
      </Card.Body>

      <Toast
        show={agregado}
        onClose={() => setAgregado(false)}
        delay={1200}
        autohide
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          minWidth: "160px",
          background: "#198754",
          color: "#fff",
          zIndex: 10,
        }}
      >
        <Toast.Body>¡Agregado al carrito!</Toast.Body>
      </Toast>
    </Card>
    
  );
};

export default CardEventos;