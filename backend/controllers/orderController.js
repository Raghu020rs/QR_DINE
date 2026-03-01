import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ================================
   Create QR Order
================================ */
export const createQrOrder = async (req, res) => {
  try {
    const { shopId, tableNo, customerPhone, items } = req.body;

    if (!shopId || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({
        msg: "Invalid order data",
      });
    }

    let orderItems = [];
    let totalAmount = 0;

    // Validate each product
    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        shopId,
        isAvailable: true,
      });

      if (!product) {
        return res.status(404).json({
          msg: "Product not found or unavailable",
        });
      }

      const orderItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        isVeg: product.isVeg,
      };

      totalAmount += product.price * item.quantity;

      orderItems.push(orderItem);
    }

    const order = await Order.create({
      shopId,
      items: orderItems,
      totalAmount,
      tableNo,
      customerPhone,
      orderSource: "qr",
      paymentStatus: "pending",
      status: "pending",
    });

    // Emit socket event to the shop's room
    const io = req.app.get("io");
    if (io) {
      io.to(shopId.toString()).emit("newOrder", {
        msg: "New order received!",
        orderNumber: order.orderNumber,
        tableNo: order.tableNo,
        totalAmount: order.totalAmount
      });
    }

    res.status(201).json({
      msg: "Order Created Successfully",
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      tableNo: order.tableNo,
      customerPhone: order.customerPhone,
      items: order.items,
    });

  } catch (error) {
    console.error("Create QR Order Error:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

/* ================================
   Get Shop Orders (Shop Admin)
================================ */
export const getShopOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.user.shopId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(orders);

  } catch (error) {
    console.error("Get Shop Orders Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Update Order Status (Shop Admin)
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "preparing", "served", "cancelled"].includes(status)) {
      return res.status(400).json({
        msg: "Invalid status. Must be: pending, preparing, served, or cancelled",
      });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.user.shopId,
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      msg: "Order Status Updated ✅",
      order,
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================================
   Get Dashboard Stats (Shop Admin)
================================ */
export const getDashboardStats = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get week start date
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    // Today's orders and revenue
    const todayOrders = await Order.find({
      shopId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = todayOrders.filter(order => order.status === 'pending').length;

    // Weekly revenue
    const weekOrders = await Order.find({
      shopId,
      createdAt: { $gte: weekStart },
    });

    const weeklyRevenue = weekOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total orders
    const totalOrders = await Order.countDocuments({ shopId });

    res.json({
      todayRevenue,
      todayOrders: todayOrders.length,
      weeklyRevenue,
      totalOrders,
      pendingOrders,
    });

  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
