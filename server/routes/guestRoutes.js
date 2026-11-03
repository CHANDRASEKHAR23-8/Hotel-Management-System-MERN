
const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");

// GET: Retrieve all guests
router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find().sort({ name: 1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch guests",
      error: error.message,
    });
  }
});

// POST: Add a new guest
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Guest name and phone are required",
      });
    }

    const guest = await Guest.create({
      name,
      phone,
      email,
      address,
    });

    res.status(201).json({
      message: "Guest added successfully",
      guest,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add guest",
      error: error.message,
    });
  }
});

module.exports = router;
