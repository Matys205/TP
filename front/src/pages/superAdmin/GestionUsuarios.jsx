import { useState, useEffect } from "react";
import { Button, Table, Modal, Spinner, Alert } from "react-bootstrap";
import { getUsuarios, eliminarUsuario } from "../../services/api";
import BuscadorUsuarios from "./BuscadorUsuarios";
import FormularioRoles from "./FormularioRoles"; // ✅ correcto
import { FaTrash } from "react-icons/fa";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [buscar, setBuscar] = useState("");

  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    const data = await getUsuarios();
    if (Array.isArray(data)) {
      setUsuarios(data);
    } else {
      setError("No se pudieron cargar los usuarios");
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const confirmarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModal(true);
  };

  const handleEliminar = async () => {
    const res = await eliminarUsuario(usuarioAEliminar._id || usuarioAEliminar.id);
    if (res.success) {
      setUsuarios((prev) =>
        prev.filter((u) => u._id !== usuarioAEliminar._id && u.id !== usuarioAEliminar.id)
      );
      setExito(`Usuario "${usuarioAEliminar.nombre}" eliminado correctamente.`);
      setTimeout(() => setExito(null), 2500);
    } else {
      setError("No se pudo eliminar el usuario");
    }
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.correo}`.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestión de Usuarios</h3>

      <BuscadorUsuarios valor={buscar} onBuscar={setBuscar} />

      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      {!cargando && usuariosFiltrados.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.role}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => confirmarEliminacion(u)}
                    title="Eliminar usuario"
                  >
                    <FaTrash className="me-1" />
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!cargando && usuariosFiltrados.length === 0 && (
        <p className="text-center text-muted mt-4">No se encontraron usuarios que coincidan.</p>
      )}

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que querés eliminar al usuario{" "}
          <strong>{usuarioAEliminar?.nombre}</strong> ({usuarioAEliminar?.correo})?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            <FaTrash className="me-1" />
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;