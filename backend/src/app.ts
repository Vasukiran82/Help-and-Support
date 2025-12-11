import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import supportRoutes from "./routes/support.routes";

const app = express(); // ✅ DECLARE APP FIRST

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", supportRoutes);

// Default route
app.get("/", (_req, res) => {
  res.send("Help & Support API Running");
});

export default app;
