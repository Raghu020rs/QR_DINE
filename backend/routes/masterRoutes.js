import express from "express";
import { 
  createShop, 
  addShopAdmin, 
  createMasterAdmin,
  getAllShops,
  getDashboardStats,
  toggleShopStatus,
  deleteShop,
} from "../controllers/masterController.js";
import { protect, isMasterAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Create Shop */
router.post("/create-shop",protect,isMasterAdmin,createShop);

/* Add Extra Shop Admin */
router.post("/add-shop-admin",protect,isMasterAdmin,addShopAdmin);

/* Create New Master Admin */
router.post("/create-admin",protect,isMasterAdmin,createMasterAdmin);

/* Get All Shops */
router.get("/shops", protect, isMasterAdmin, getAllShops);

/* Get Dashboard Stats */
router.get("/dashboard-stats", protect, isMasterAdmin, getDashboardStats);

/* Toggle Shop Status */
router.patch("/shop/:shopId/toggle-status", protect, isMasterAdmin, toggleShopStatus);

/* Delete Shop */
router.delete("/shop/:shopId", protect, isMasterAdmin, deleteShop);


export default router;
