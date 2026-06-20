import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoute from "./router/authRoute.js";
import leadRoute from "./router/leadRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

app.use("/api/auth", authRoute);
app.use("/api/leads", leadRoute);

app.get("/", (req, res) => res.send("Server running"));

connectDB();
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
