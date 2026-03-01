import Admin from "../models/Admin.js";
import ShopAdmin from "../models/ShopAdmin.js";
import generateToken from "../utils/genToken.js";



/* ================================
   Master Admin Login
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Match Password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate Token
    const token = generateToken(admin._id, "master");

    res.json({
      token,
      role: "master",
      name: admin.name,
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Shop Admin Login
================================ */
export const shopLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Shop Admin
    const shopAdmin = await ShopAdmin.findOne({ email });

    if (!shopAdmin || !shopAdmin.isActive) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Match Password
    const isMatch = await shopAdmin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate Token
    const token = generateToken(
      shopAdmin._id,
      "shop",
      shopAdmin.shopId
    );

    res.json({
      token,
      role: "shop",
      name: shopAdmin.name,
      shopId: shopAdmin.shopId,
    });

  } catch (error) {
    console.error("Shop Login Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
