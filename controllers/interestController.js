const Interest = require("../models/Interest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ✅ SEND INTEREST
exports.sendInterest = async (req, res) => {
  try {
    const { toUserId } = req.body;

    if (req.user.id === toUserId) {
      return res.status(400).json({ message: "Cannot send interest to yourself" });
    }

    const existing = await Interest.findOne({
      fromUser: req.user.id,
      toUser: toUserId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already sent interest" });
    }

    const interest = await Interest.create({
      fromUser: req.user.id,
      toUser: toUserId,
    });

    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(toUserId);

    // 📩 Email to receiver (same logic as lead OTP email)
    await sendEmail({
      to: receiver.email,
      subject: "❤️ New Interest Received",
      html: `
        <h2>Hello ${receiver.name},</h2>
        <p><strong>${sender.name}</strong> is interested in your profile.</p>
        <p>Please login to view and respond.</p>
      `,
    });

    res.json({ message: "Interest sent", interest });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET RECEIVED REQUESTS
exports.getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ toUser: req.user.id })
      .populate("fromUser", "name email");

    res.json(interests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📤 GET SENT REQUESTS
exports.getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ fromUser: req.user.id })
      .populate("toUser", "name email");

    res.json(interests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅❌ ACCEPT / REJECT
exports.respondInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const interest = await Interest.findById(id);

    if (!interest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (interest.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    interest.status = status;
    await interest.save();

    const sender = await User.findById(interest.fromUser);
    const receiver = await User.findById(interest.toUser);

    // 📩 Email to sender (same logic as confirmation mail in your lead system)
    if (status === "accepted") {
      await sendEmail({
        to: sender.email,
        subject: "🎉 Your Request is Accepted",
        html: `
          <h2>Hello ${sender.name},</h2>
          <p><strong>${receiver.name}</strong> accepted your interest ❤️</p>
        `,
      });
    }

    if (status === "rejected") {
      await sendEmail({
        to: sender.email,
        subject: "Request Update",
        html: `
          <h2>Hello ${sender.name},</h2>
          <p>Your interest request was not accepted.</p>
        `,
      });
    }

    res.json({ message: `Request ${status}`, interest });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};