const express = require("express");
const router = express.Router();
const { getEvents, createEvent, deleteEvent, modifyEvent,getEventById } = require("../controllers/eventsController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Obtener todos los eventos (acceso según necesidad)
router.get("/", getEvents);

// Crear un evento (solo admin y super admin)
router.post("/", verifyRole("admin", "super_admin", "super-admin"), createEvent);

//Modificar un evento
router.put("/:id", verifyRole("admin", "super_admin", "super-admin"), modifyEvent);

// Eliminar evento (solo admin o superadmin)
router.delete("/:id", verifyToken, verifyRole("admin", "super_admin", "super-admin"), deleteEvent);

// Obtener un evento por ID
router.get("/:id", getEventById);

module.exports = router;