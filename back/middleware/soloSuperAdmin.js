const soloSuperAdmin = (req, res, next) => {
  // Normaliza el nombre del rol para aceptar "super_admin" o "super-admin"
  const role = req.usuario?.role?.replace("-", "_");
  if (role !== "super_admin") {
    return res.status(403).json({ error: "Acceso denegado: solo para super administradores." });
  }
  next();
};

module.exports = soloSuperAdmin;