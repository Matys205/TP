import { useState } from "react";
import { Button, Card, Row, Col, Form, Alert, Spinner } from "react-bootstrap";
import lugaresDisponibles from "../../../data/lugares";

const AgregarEvento = ({ OnEventoAdded }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [lugar, setLugar] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [disponible, setDisponible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleAgregarEvento = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setMensaje(null);
    setError(null);

    const nuevoEvento = {
      nombre,
      descripcion,
      fecha,
      horario,
      lugar,
      precio,
      imagen,
      disponible,
    };

    const token = localStorage.getItem("token"); // O donde guardes tu token

    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEvento),
      });

      if (response.ok) {
        // Limpia los campos o muestra mensaje de éxito
        setNombre("");
        setDescripcion("");
        setFecha("");
        setHorario("");
        setLugar("");
        setPrecio("");
        setImagen("");
        setDisponible(false)
        setMensaje("✅ Evento agregado correctamente.");
        if (OnEventoAdded) OnEventoAdded();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        const data = await response.json();
        setError(data?.error || "Error al agregar evento");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card bg="dark" text="light" className="mx-auto my-4 p-4" style={{ maxWidth: "600px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.7)" }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
          Agregar Nuevo Evento
        </Card.Title>

        {mensaje && <Alert variant="success" className="text-center">{mensaje}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form className="formulario-agregar-evento text-dark" onSubmit={handleAgregarEvento} noValidate>
          <Form.Group controlId="nombre" className="mb-3">
            <Form.Label>Nombre del Evento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              minLength={3}
              maxLength={50}
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingrese un nombre válido (mínimo 3 caracteres).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="descripcion" className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              maxLength={200}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="fecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="horario">
              <Form.Label>Horario</Form.Label>
              <Form.Control
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
              />
            </Form.Group>
          </Row>

          <Form.Group controlId="lugar" className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Select
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              required
            >
              <option value="">Seleccione un lugar...</option>
              {lugaresDisponibles.map(({ value, label }) => (
                <option key={value} value={label}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="precio" className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group controlId="imagen" className="mb-4">
            <Form.Label>URL de imagen del evento</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              pattern="https?://.+"
              title="Ingrese una URL válida que comience con http:// o https://"
            />
          </Form.Group>

          <Form.Group controlId="disponible" >
              <Form.Check 
                type="switch"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
                label={disponible ? "Disponible" : "No disponible"}
              />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg" disabled={enviando}>
              {enviando ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Agregando...
                </>
              ) : (
                "Agregar Evento"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgregarEvento;