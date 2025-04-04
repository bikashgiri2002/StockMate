import express from "express";
import Warehouse from "../models/warehouseModel.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Warehouse (Protected)
router.post("/", protect, async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    const warehouse = await Warehouse.create({
      shopId: req.shop._id,
      name,
      location,
      capacity,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get All Warehouses for a Shop (Protected)
router.get("/", protect, async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ shopId: req.shop._id });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Delete a Warehouse by ID (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const warehouse = await Warehouse.findOneAndDelete({
      _id: req.params.id,
      shopId: req.shop._id,
    });

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
