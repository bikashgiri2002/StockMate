import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import shopRoutes from "./routes/shopRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/shop", shopRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);




// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
connectDB()
.then(() => {
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
}).catch((err) => console.log(err.message))
