import { Button, Modal } from "react-bootstrap";
import { useCart } from "../../contexts/carritoContext/CarritoContext";
import { useSesion } from "../../contexts/sesionContext/SesionContext";
import { useState } from "react";

const Carrito = () => {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart();
  const { usuario } = useSesion();
  const [showVaciar, setShowVaciar] = useState(false);

  // Estados para pago simulado
  const [showSimulado, setShowSimulado] = useState(false);
  const [formSimulado, setFormSimulado] = useState({
    nombre: "",
    tarjeta: "",
    vencimiento: "",
    codigo: ""
  });
  const [pagoExitoso, setPagoExitoso] = useState(false);

  const handleAumentarCant = (eventoId) => {
    actualizarCantidad(eventoId, 1);
  }
  const handleDisminuirCant = (eventoId) => {
    const evento = carrito.find((evento) => evento.id === eventoId)
    if(evento.cantidad > 1){
      actualizarCantidad(eventoId, -1)
    }
  }

  const totalPagar = carrito.reduce((total, evento) => total + Number(evento.precioEvento ?? evento.precio) * evento.cantidad, 0);

  // PAGO MERCADO PAGO
  const pagarConMercadoPago = async () => {
    if (!usuario?.correo) {
      alert("Debes iniciar sesión para pagar.");
      return;
    }
    const items = carrito.map(item => {
      const precio = Number(item.precioEvento ?? item.precio);
      return {
        title: item.nombreEvento || item.nombre,
        quantity: item.cantidad,
        unit_price: precio,
      };
    });

    if (items.some(i => isNaN(i.unit_price) || i.unit_price <= 0)) {
      alert("Hay productos con precio inválido en el carrito.");
      return;
    }

    const response = await fetch("http://localhost:3001/api/pago/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        email: usuario.correo,
      }),
    });
    const data = await response.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Error al iniciar el pago. Intenta nuevamente.");
    }
  };

  // PAGO SIMULADO
  const handleSimuladoChange = e => {
    setFormSimulado({ ...formSimulado, [e.target.name]: e.target.value });
  };

  const handleSimuladoSubmit = async e => {
    e.preventDefault();

    // Validación básica
    if (!usuario?.id) {
      alert("Debes iniciar sesión para pagar.");
      return;
    }
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // Por cada evento en el carrito, registrar una venta
    try {
      for (const evento of carrito) {
        await fetch("http://localhost:3001/api/pago/registrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.id,
            evento_id: evento.id,
            cantidad: evento.cantidad,
            total: Number(evento.precioEvento ?? evento.precio) * evento.cantidad,
            estado_pago: "simulado",
            email_cliente: usuario.correo,
            datos_extra: {
              nombre: formSimulado.nombre,
              tarjeta: formSimulado.tarjeta,
              vencimiento: formSimulado.vencimiento,
              codigo: formSimulado.codigo
            }
          })
        });
      }
      setPagoExitoso(true);
      setTimeout(() => {
        setShowSimulado(false);
        setPagoExitoso(false);
        vaciarCarrito();
        setFormSimulado({
          nombre: "",
          tarjeta: "",
          vencimiento: "",
          codigo: ""
        });
      }, 2000);
    } catch (error) {
      alert("Error al registrar el pago simulado.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p className="text-center">El carrito está vacío</p>
      ) : (
        <div>
          <ul className="list-group">
            {carrito.map((evento) => (
              <li key={evento.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{evento.nombreEvento || evento.nombre}</span>
                  <p className="mb-0">${Number(evento.precioEvento ?? evento.precio).toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <Button variant="outline-secondary" size="sm" onClick={() => handleDisminuirCant(evento.id)}>-</Button>
                  <input
                    type="number"
                    readOnly
                    value={evento.cantidad}
                    className="form-control text-center mx-2"
                    style={{ width: '60px' }}
                  />
                  <Button variant="outline-secondary" size="sm" onClick={() => handleAumentarCant(evento.id)}>+</Button>
                </div>
                <div>
                  <p className="mb-0 fw-bold">${(Number(evento.precioEvento ?? evento.precio) * evento.cantidad).toFixed(2)}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => eliminarDelCarrito(evento.id)} title="Eliminar del carrito">
                  <i className="bi bi-trash"></i>
                </Button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="danger" size="sm" onClick={() => setShowVaciar(true)}>
              <i className="bi bi-trash"></i> Vaciar Carrito
            </Button>
            <h4 className="mb-0">
              Total a Pagar: <span className="text-primary">${totalPagar.toFixed(2)}</span>
            </h4>
          </div>
          <div className="mt-4 text-end d-flex gap-2 justify-content-end">
            <Button variant="success" size="lg" onClick={pagarConMercadoPago}>
              Pagar con Mercado Pago
            </Button>
            <Button variant="primary" size="lg" onClick={() => setShowSimulado(true)}>
              Pagar
            </Button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para vaciar carrito */}
      <Modal show={showVaciar} onHide={() => setShowVaciar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vaciar Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas vaciar el carrito?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVaciar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => { vaciarCarrito(); setShowVaciar(false); }}>
            Vaciar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de pago simulado */}
      <Modal show={showSimulado} onHide={() => setShowSimulado(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pago Simulado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pagoExitoso ? (
            <div className="text-success text-center">
              ¡Pago realizado con éxito!
            </div>
          ) : (
            <form onSubmit={handleSimuladoSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre en la tarjeta</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formSimulado.nombre}
                  onChange={handleSimuladoChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Número de tarjeta</label>
                <input
                  type="text"
                  className="form-control"
                  name="tarjeta"
                  value={formSimulado.tarjeta}
                  onChange={handleSimuladoChange}
                  required
                  maxLength={16}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vencimiento</label>
                <input
                  type="text"
                  className="form-control"
                  name="vencimiento"
                  value={formSimulado.vencimiento}
                  onChange={handleSimuladoChange}
                  placeholder="MM/AA"
                  required
                  maxLength={5}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Código de seguridad</label>
                <input
                  type="text"
                  className="form-control"
                  name="codigo"
                  value={formSimulado.codigo}
                  onChange={handleSimuladoChange}
                  required
                  maxLength={4}
                />
              </div>
              <Button variant="primary" type="submit" className="w-100">
                Confirmar Pago
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Carrito;