import express from "express";
import { 
  createQrOrder, 
  getShopOrders, 
  updateOrderStatus,
  getDashboardStats 
} from "../controllers/orderController.js";
import { protect, isShopAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public QR Order */
router.post("/qr", createQrOrder);

/* Shop Admin - Get Orders */
router.get("/shop-orders", protect, isShopAdmin, getShopOrders);

/* Shop Admin - Update Order Status */
router.patch("/:orderId/status", protect, isShopAdmin, updateOrderStatus);

/* Shop Admin - Dashboard Stats */
router.get("/dashboard-stats", protect, isShopAdmin, getDashboardStats);

export default router;
