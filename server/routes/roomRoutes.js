
const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// GET: View all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
});

// POST: Add a new room
router.post("/", async (req, res) => {
  try {
    const { roomNumber, roomType, price, capacity, status } = req.body;

    const room = await Room.create({
      roomNumber,
      roomType,
      price,
      capacity,
      status,
    });

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add room",
      error: error.message,
    });
  }
});

module.exports = router;
