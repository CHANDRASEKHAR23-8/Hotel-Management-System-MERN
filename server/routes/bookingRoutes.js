
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Guest = require("../models/Guest");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("guest", "name phone email")
      .populate("room", "roomNumber roomType price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a booking
router.post("/", async (req, res) => {
  try {
    const { guest, room, checkIn, checkOut } = req.body;

    if (!guest || !room || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "Guest, room, check-in date and check-out date are required.",
      });
    }

    if (
      !mongoose.isValidObjectId(guest) ||
      !mongoose.isValidObjectId(room)
    ) {
      return res.status(400).json({
        message: "Invalid guest or room ID.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date.",
      });
    }

    const guestExists = await Guest.findById(guest);
    if (!guestExists) {
      return res.status(404).json({ message: "Guest not found." });
    }

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (roomExists.status !== "Available") {
      return res.status(400).json({
        message: "This room is not available.",
      });
    }

    const overlappingBooking = await Booking.findOne({
      room,
      status: { $in: ["Booked", "Checked In"] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "This room is already booked for those dates.",
      });
    }

    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalAmount = nights * roomExists.price;

    const booking = await Booking.create({
      guest,
      room,
      checkIn: start,
      checkOut: end,
      totalAmount,
      status: "Booked",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("guest", "name phone email")
      .populate("room", "roomNumber roomType price");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHECK-IN
router.patch("/:id/check-in", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status !== "Booked") {
      return res.status(400).json({
        message: "Only booked reservations can be checked in.",
      });
    }

    const room = await Room.findById(booking.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    booking.status = "Checked In";
    room.status = "Occupied";

    await booking.save();
    await room.save();

    res.json({ message: "Guest checked in successfully!", booking, room });
  } catch (error) {
    res.status(500).json({
      message: "Check-in failed.",
      error: error.message,
    });
  }
});

// CHECK-OUT
router.patch("/:id/check-out", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status !== "Checked In") {
      return res.status(400).json({
        message: "Only checked-in guests can check out.",
      });
    }

    const room = await Room.findById(booking.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    booking.status = "Checked Out";
    room.status = "Available";

    await booking.save();
    await room.save();

    res.json({ message: "Guest checked out successfully!", booking, room });
  } catch (error) {
    res.status(500).json({
      message: "Check-out failed.",
      error: error.message,
    });
  }
});

module.exports = router;
