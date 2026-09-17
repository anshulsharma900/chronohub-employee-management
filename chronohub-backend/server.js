import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reimbursementRoutes from "./routes/reimbursementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reimbursements", reimbursementRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ChronoHub API Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import protect from "./middleware/authMiddleware.js";
import authorizeRoles from "./middleware/roleMiddleware.js";


app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});


app.get("/api/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route working" });
});
