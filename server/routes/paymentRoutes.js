
const express = require("express");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const router = express.Router();

// GET: Fetch all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "booking",
        populate: [
          { path: "guest", select: "name phone" },
          { path: "room", select: "roomNumber roomType price" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error("Fetch payments error:", error);
    res.status(500).json({
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
});

// POST: Create a payment
router.post("/", async (req, res) => {
  try {
    const { booking, amount, paymentMethod, status } = req.body;

    if (
      !booking ||
      !mongoose.Types.ObjectId.isValid(booking) ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "Booking, amount, and payment method are required.",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Payment amount must be greater than zero.",
      });
    }

    const bookingExists = await Booking.findById(booking);

    if (!bookingExists) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const allowedMethods = ["Cash", "UPI", "Card", "Bank Transfer"];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    const allowedStatuses = ["Pending", "Paid"];
    const paymentStatus = status || "Pending";

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status.",
      });
    }

    const payment = await Payment.create({
      booking,
      amount: numericAmount,
      paymentMethod,
      status: paymentStatus,
    });

    const savedPayment = await Payment.findById(payment._id)
      .populate({
        path: "booking",
        populate: [
          { path: "guest", select: "name phone" },
          { path: "room", select: "roomNumber roomType price" },
        ],
      });

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({
      message: "Failed to create payment.",
      error: error.message,
    });
  }
});

module.exports = router;
