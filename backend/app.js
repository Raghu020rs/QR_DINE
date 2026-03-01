import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


const app = express();

app.use(cors());

app.use(cors({
  origin: "*",   // for testing
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

export default app;
