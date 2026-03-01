import Product from "../models/Product.js";
import Shop from "../models/Shop.js";

/* ================================
   Add Product (Shop Admin)
================================ */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      image,
      isVeg,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        msg: "Name, price and category are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      image,
      isVeg,
      shopId: req.user.shopId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      msg: "Product Added ✅",
      product,
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Update Product
================================ */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.user.shopId,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    Object.assign(product, req.body);

    await product.save();

    res.json({
      msg: "Product Updated ✅",
      product,
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Delete Product
================================ */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.user.shopId,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await product.deleteOne();

    res.json({ msg: "Product Deleted ✅" });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Get Shop Menu (Public)
================================ */
export const getShopMenu = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.params.shopId,
      isAvailable: true,
    }).sort({ category: 1, name: 1 });

    res.json(products);

  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Get All Products (Shop Admin)
================================ */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.user.shopId,
    }).sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Toggle Availability
================================ */
export const toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.user.shopId,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.json({
      msg: "Availability Updated ✅",
      isAvailable: product.isAvailable,
    });

  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Get Shop Profile (Shop Admin)
================================ */
export const getShopProfile = async (req, res) => {
  try {
    const shop = await Shop.findById(req.user.shopId);

    if (!shop) {
      return res.status(404).json({ msg: "Shop not found" });
    }

    res.json(shop);

  } catch (error) {
    console.error("Get Shop Profile Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Update Shop Profile (Shop Admin)
================================ */
export const updateShopProfile = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      phone,
      address,
      description,
      openingTime,
      closingTime,
    } = req.body;

    const shop = await Shop.findById(req.user.shopId);

    if (!shop) {
      return res.status(404).json({ msg: "Shop not found" });
    }

    // Update allowed fields
    if (name) shop.name = name;
    if (ownerName) shop.ownerName = ownerName;
    if (phone) shop.phone = phone;
    if (address !== undefined) shop.address = address;
    if (description !== undefined) shop.description = description;
    if (openingTime !== undefined) shop.openingTime = openingTime;
    if (closingTime !== undefined) shop.closingTime = closingTime;

    await shop.save();

    res.json({
      msg: "Shop Profile Updated ✅",
      shop,
    });

  } catch (error) {
    console.error("Update Shop Profile Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
