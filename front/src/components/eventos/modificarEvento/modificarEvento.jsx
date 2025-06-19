import { useState } from "react";
import { Card, Form, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { modificarEvento } from "../../services/api"; // ✅ Conectar con backend

const ModificarEvento = ({ OnModificarEvento }) => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [imagen, setImagen] = useState("");
  const [disponible, setDisponible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleModificarEvento = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setMensaje(null);
    setError(null);

    if (!nombre || !fecha || !horario || !imagen) {
      setError("Todos los campos son obligatorios.");
      setEnviando(false);
      return;
    }

    const dataEvento = {
      nombre,
      fecha,
      horario,
      imagen,
      disponible,
    };

    try {
      const resultado = await modificarEvento(dataEvento); // ✅ Envía datos al backend
      if (resultado.success) {
        OnModificarEvento && OnModificarEvento(resultado.evento); // ✅ Llama la función si la modificación es exitosa
        setMensaje("✅ Evento modificado correctamente.");
        setNombre("");
        setFecha("");
        setHorario("");
        setImagen("");
        setDisponible(false);
        setTimeout(() => setMensaje(null), 2500);
      } else {
        setError(resultado.error || "Error al modificar evento.");
      }
    } catch (error) {
      setError("❌ Error al modificar evento.");
      console.error("❌ Error al modificar evento:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card className="container d-block justify-content-center text-center my-4 p-3" style={{ maxWidth: 600 }}>
      <Card.Body>
        <Card.Title className="mb-4" style={{ fontWeight: 600, fontSize: "1.5rem" }}>
          Modificar Evento
        </Card.Title>
        {mensaje && <Alert variant="success" className="text-center">{mensaje}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <Form onSubmit={handleAgregarEvento}>
          <Row className="justify-content-center">
            <Col md={8}>
              <Form.Group className="mb-4">
                <Form.Label>Nombre Evento</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  minLength={3}
                  maxLength={50}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-4">
                <Form.Label>Fecha Evento</Form.Label>
                <Form.Control
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8}>
              <Form.Group className="mb-4">
                <Form.Label>Horario Evento</Form.Label>
                <Form.Control
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-4">
                <Form.Label>Imagen Evento</Form.Label>
                <Form.Control
                  type="url"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  required
                  placeholder="https://ejemplo.com/imagen.jpg"
                  pattern="https?://.+"
                  title="Ingrese una URL válida que comience con http:// o https://"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col md={8}>
              <Form.Group>
                <Form.Check
                  type="switch"
                  label="Disponibilidad"
                  onChange={(e) => setDisponible(e.target.checked)}
                  checked={disponible}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={enviando}
                style={{ minWidth: 180 }}
              >
                {enviando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Modificando...
                  </>
                ) : (
                  "Modificar evento"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ModificarEvento;