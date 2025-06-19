import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  // Carga inicial desde localStorage
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarCarrito = (eventoNuevo) => {
    if(!eventoNuevo.disponible) {
      return false;
    }
    setCarrito((carritoAnterior) => {
      const indexExistente = carritoAnterior.findIndex(
        (item) => item.id === eventoNuevo.id
      );

      if (indexExistente !== -1) {
        return carritoAnterior.map((item, index) =>
          index === indexExistente
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...carritoAnterior, { ...eventoNuevo, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (eventoId, cantidad) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.map((item) =>
        item.id === eventoId
          ? { ...item, cantidad: Math.max(item.cantidad + cantidad, 1) }
          : item
      )
    );
  };

  const eliminarDelCarrito = (eventoId) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((item) => item.id !== eventoId)
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Devuelve el total del carrito
  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCart = () => useContext(CarritoContext);