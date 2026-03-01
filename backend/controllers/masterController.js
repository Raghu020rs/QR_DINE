import Shop from "../models/Shop.js";
import ShopAdmin from "../models/ShopAdmin.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";

/* ================================
   Create Shop + Shop Admin
================================ */
export const createShop = async (req, res) => {
    try {
        const {
            shopName,
            ownerName,
            email,
            phone,
            password,
            address,
        } = req.body;

        // Validate
        if (
            !shopName ||
            !ownerName ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                msg: "All required fields must be filled",
            });
        }

        // Check if email exists
        const adminExists = await ShopAdmin.findOne({ email });

        if (adminExists) {
            return res
                .status(400)
                .json({ msg: "Email already registered" });
        }

        /* Create Shop */
        const shop = await Shop.create({
            name: shopName,
            ownerName,
            phone,
            email,
            address,
            createdBy: req.user._id,
        });

        /* Generate QR URL */
        const qrUrl = `${process.env.FRONTEND_URL}/shop/${shop._id}`;

        shop.qrUrl = qrUrl;
        await shop.save();

        /* Create Shop Admin */
        const shopAdmin = await ShopAdmin.create({
            name: ownerName,
            email,
            phone,
            password, // auto hashed
            shopId: shop._id,
        });

        res.status(201).json({
            msg: "Shop Created Successfully ✅",

            shop: {
                id: shop._id,
                name: shop.name,
                qrUrl: shop.qrUrl,
                status: shop.status,
            },

            admin: {
                name: shopAdmin.name,
                email: shopAdmin.email,
            },
        });

    } catch (error) {
        console.error("Create Shop Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

/* ================================
   Add Extra Shop Admin
================================ */
export const addShopAdmin = async (req, res) => {
    try {
        const {
            shopId,
            name,
            email,
            phone,
            password,
        } = req.body;

        // Validate
        if (!shopId || !name || !email || !phone || !password) {
            return res.status(400).json({
                msg: "All required fields are mandatory",
            });
        }

        // Check if email exists
        const exists = await ShopAdmin.findOne({ email });

        if (exists) {
            return res.status(400).json({
                msg: "Admin already exists with this email",
            });
        }

        // Create New Shop Admin
        const shopAdmin = await ShopAdmin.create({
            name,
            email,
            phone,
            password, // auto hashed
            shopId,
        });

        res.status(201).json({
            msg: "New Shop Admin Created ✅",
            admin: {
                id: shopAdmin._id,
                name: shopAdmin.name,
                email: shopAdmin.email,
                phone: shopAdmin.phone,
            },
        });

    } catch (error) {
        console.error("Add Shop Admin Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

/* ================================
   Create New Master Admin
================================ */
export const createMasterAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        // Check if admin already exists
        const exists = await Admin.findOne({ email });

        if (exists) {
            return res.status(400).json({
                msg: "Admin already exists with this email",
            });
        }

        // Create Admin (password auto-hashed)
        const admin = await Admin.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            msg: "New Master Admin Created ✅",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });

    } catch (error) {
        console.error("Create Master Admin Error:", error);
        res.status(500).json({
            msg: "Server Error",
        });
    }
};

/* ================================
   Get All Shops
================================ */
export const getAllShops = async (req, res) => {
    try {
        console.log('getAllShops called by user:', req.user?._id);
        const shops = await Shop.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        console.log(`Found ${shops.length} shops`);
        res.json(shops);
    } catch (error) {
        console.error("Get All Shops Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

/* ================================
   Get Dashboard Stats
================================ */
export const getDashboardStats = async (req, res) => {
    try {
        const totalShops = await Shop.countDocuments();
        const activeShops = await Shop.countDocuments({ status: 'active' });
        const blockedShops = await Shop.countDocuments({ status: 'blocked' });
        const totalAdmins = await ShopAdmin.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({
            totalShops,
            activeShops,
            blockedShops,
            totalAdmins,
            totalOrders,
        });
    } catch (error) {
        console.error("Get Dashboard Stats Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

/* ================================
   Toggle Shop Status
================================ */
export const toggleShopStatus = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ msg: "Shop not found" });
        }

        shop.status = shop.status === 'active' ? 'blocked' : 'active';
        await shop.save();

        res.json({
            msg: `Shop ${shop.status === 'active' ? 'activated' : 'blocked'} successfully`,
            status: shop.status,
        });
    } catch (error) {
        console.error("Toggle Shop Status Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

/* ================================
   Delete Shop
================================ */
export const deleteShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ msg: "Shop not found" });
        }

        // Delete associated shop admins
        await ShopAdmin.deleteMany({ shopId });

        // Delete the shop
        await shop.deleteOne();

        res.json({ msg: "Shop deleted successfully" });
    } catch (error) {
        console.error("Delete Shop Error:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};
