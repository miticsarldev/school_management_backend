import { Router } from "express";

import { validateUser } from "../middlewares/validateUser";
import {
  deleteUser,
  getUsers,
  login,
  logout,
  refreshToken,
  register,
  updateUser,
} from "../controllers/authController";
import upload from "../middlewares/upload";

const router = Router();

// Registration
router.post("/register", validateUser, upload, register);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", logout);

// Get all users
router.get("/users", getUsers);

// Update user
router.patch("/users/:id", validateUser, upload, updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

export default router;
