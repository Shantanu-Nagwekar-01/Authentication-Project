import express from "express";
import { createUser, deleteUser, getUsers, updateUser, loginUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
