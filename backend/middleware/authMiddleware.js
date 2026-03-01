import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import ShopAdmin from "../models/ShopAdmin.js";

/* =========================
   Verify JWT (Common)
========================= */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try Admin
      let user = await Admin.findById(decoded.id).select("-password");
      let role = "master";

      // If not Admin, try ShopAdmin
      if (!user) {
        user = await ShopAdmin.findById(decoded.id).select("-password");
        role = "shop";
      }

      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user;
      req.user.role = role;

      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }
};

/* =========================
   Master Admin Only
========================= */
export const isMasterAdmin = (req, res, next) => {
  if (req.user && req.user.role === "master") {
    next();
  } else {
    return res.status(403).json({
      msg: "Only Master Admin can access this route",
    });
  }
};

/* =========================
   Shop Admin Only
========================= */
export const isShopAdmin = (req, res, next) => {
  if (req.user && req.user.role === "shop") {
    next();
  } else {
    return res.status(403).json({
      msg: "Only Shop Admin can access this route",
    });
  }
};
