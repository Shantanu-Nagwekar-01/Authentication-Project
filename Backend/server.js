import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // ✅ Import CORS
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ✅ Use CORS Middleware to allow frontend requests
app.use(cors({
    origin: "http://127.0.0.1:5500",  // Allow requests from frontend
    credentials: true,
}));

app.use(express.json()); // allows JSON data in req.body

// ✅ Fix Route Path (userss → users)
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("✅ Server started at http://localhost:" + PORT);
});
