import { createContext, useContext, useEffect, useState } from "react";

const SesionContext = createContext();

export const SesionProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        console.warn("⚠️ Error al leer usuario de localStorage:", e);
        setUsuario(null);
      }
    }
  }, []);

  // Guardar en localStorage al actualizar usuario
  const loginUsuario = (datos) => {
    localStorage.setItem("user", JSON.stringify(datos));
    localStorage.setItem("token", datos.token);
    setUsuario(datos);
  };

  const logoutUsuario = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUsuario(null);
  };

  // Método para obtener el token actual
  const getToken = () => localStorage.getItem("token");

  return (
    <SesionContext.Provider value={{ usuario, loginUsuario, logoutUsuario, getToken }}>
      {children}
    </SesionContext.Provider>
  );
};

export const useSesion = () => useContext(SesionContext);