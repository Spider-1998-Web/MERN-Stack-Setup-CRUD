import express from "express";
import dotenv from "dotenv";
import path from "path";
import productRoutes from "./routes/productRoute.js"

import { connectDB } from "./config/db.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/products", productRoutes);

connectDB();











const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
