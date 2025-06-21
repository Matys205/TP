import { FaGithub, FaUser } from "react-icons/fa";

const PiePagina = () => {
  const anio = new Date().getFullYear();
  return (
    <footer className="piePagina text-center py-4 bg-dark text-light mt-5">
      
      <h5 className="mb-4">virTicket Desarrolladores</h5>
      
      <div
        className="d-flex justify-content-center mb-4"
        style={{ gap: "3rem", flexWrap: "wrap" }}
      >
        <span className="d-flex align-items-center gap-2">
          <FaUser /> Matías
        </span>
        <span className="d-flex align-items-center gap-2">
          <FaUser /> Federico
        </span>
        <span className="d-flex align-items-center gap-2">
          <FaUser /> Tiziana
        </span>
        <span className="d-flex align-items-center gap-2">
          <FaUser /> Lorenzo
        </span>
        <a
          href="https://github.com/Matys205/TP"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light ms-4 d-flex align-items-center gap-2"
          title="Ver en GitHub"
          style={{ textDecoration: "underline" }}
        >
          <FaGithub size={22} />
          GitHub
        </a>
      </div>
      
      <p className="mb-0" style={{ marginLeft: "2.5rem" }}>
        © {anio} Todos los derechos reservados
      </p>
    </footer>
  );
};

export default PiePagina;