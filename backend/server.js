import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

await connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Store io in express app so controllers can access it
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via Socket.io:", socket.id);

  // Shop admin joins their specific shop room
  socket.on("joinShop", (shopId) => {
    socket.join(shopId);
    console.log(`Socket ${socket.id} joined room: ${shopId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* Start Server */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});