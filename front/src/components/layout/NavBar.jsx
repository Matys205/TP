import { Button, Offcanvas } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Buscador from "../eventos/buscador/buscador";
import Login from "../auth/Login";
import { useSesion } from "../../contexts/sesionContext/SesionContext";
import "../../App.css";
import logo from "../../assets/logo/logoestirado.png";
import {
  FaUserShield,
  FaPlus,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaUsers
} from "react-icons/fa";

const NavBar = ({ buscar, setBuscar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logoutUsuario, loginUsuario } = useSesion();

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const isAdmin = usuario?.role === "admin";
  const isSuper = usuario?.role === "super_admin";

  const mostrarBuscador = location.pathname === "/mostrarEvento";

  const cerrarMenu = () => setMostrarMenu(false);

  return (
    <>
      <nav
  className="navegacion"
  style={{
    background: "#181818",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
    height: "100px", // altura fija del navbar
    paddingTop: "1rem",
    paddingBottom: "0.5rem",
  }}
>
        <div
  className="container-fluid d-flex justify-content-between align-items-center"
  style={{ paddingLeft: "15rem", paddingRight: "15rem" }}
>
          <Link to="/" className="navbar-logo d-flex align-items-center gap-2" style={{ textDecoration: "none" }}>
   <img
  src={logo}
  alt="virTicket Logo"
  className="logo-img"
  style={{
    height: "100%",   // se adapta al contenedor
    maxHeight: "190px", // altura máxima permitida
    width: "auto",
  }}
/>
            
          </Link>

          <div className="d-flex align-items-center gap-3">
          {mostrarBuscador && (
    <Buscador buscador={buscar} OnSearch={setBuscar} />
  )}

  {!usuario && (
    <div className="d-none d-md-block">
      <Login />
    </div>
  )}

  {usuario && (
    <Button variant="outline-light" onClick={() => setMostrarMenu(true)}>
      <FaBars />
    </Button>
  )}
</div>
        </div>
      </nav>

      <Offcanvas placement="end" show={mostrarMenu} onHide={cerrarMenu} backdrop>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column gap-3">

          {usuario ? (
            <>
              <div className="text-muted">
                <FaUserShield className="me-1" />
                {usuario.nombre} ({usuario.role})
              </div>

              {isAdmin || isSuper ? (
                <Link to="/agregarEvento" onClick={cerrarMenu}>
                  <Button variant="success" className="w-100">
                    <FaPlus className="me-2" />
                    Agregar Evento
                  </Button>
                </Link>
              ) : null}

              {isSuper && (
                <>
                  <Link to="/roles" onClick={cerrarMenu}>
                    <Button variant="info" className="w-100">
                      <FaUserShield className="me-2" />
                      Asignar Roles
                    </Button>
                  </Link>
                  <Link to="/usuarios" onClick={cerrarMenu}>
                    <Button variant="danger" className="w-100">
                      <FaUsers className="me-2" />
                      Gestionar Usuarios
                    </Button>
                  </Link>
                  <Link to="/eventos" onClick={cerrarMenu}>
                    <Button variant="danger" className="w-100">
                      <FaUsers className="me-2" />
                      Gestionar Eventos
                    </Button>
                  </Link>
                </>
              )}

              {!isAdmin && !isSuper && (
                <Link to="/carrito" onClick={cerrarMenu}>
                  <Button variant="outline-primary" className="w-100">
                    <FaShoppingCart className="me-2" />
                    Carrito
                  </Button>
                </Link>
              )}

              <Button variant="danger" className="w-100" onClick={() => { logoutUsuario(); cerrarMenu(); }}>
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <div className="d-md-none">
              {/* Login solo para móviles dentro del menú */}
              <Login />
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavBar;