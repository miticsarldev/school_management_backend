import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";

const router = Router();

// Route pour créer un nouvel événement
router.post("/events", createEvent);

// Route pour lister tous les événements
router.get("/events", getAllEvents);

// Route pour mettre à jour un événement existant
router.put("/events/:id", updateEvent);

// Route pour supprimer un événement
router.delete("/events/:id", deleteEvent);

export default router;
