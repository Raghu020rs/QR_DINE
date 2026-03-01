import express from "express";
import {adminLogin,shopLogin} from "../controllers/authController.js";

const router = express.Router();

/* Master Admin Login */
router.post("/admin/login", adminLogin);

/* Shop Admin Login */
router.post("/shop/login", shopLogin);

export default router;


