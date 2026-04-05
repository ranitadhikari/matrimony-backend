const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 80,
    },

    height: {
      type: String,
    },

    religion: String,
    caste: String,

    maritalStatus: {
      type: String,
      enum: ["unmarried", "divorced", "widow"],
      required: true,
    },

    disability: {
      hasDisability: {
        type: Boolean,
        default: false,
      },
      details: {
        type: String,
        default: "",
      },
    },

    education: String,
    occupation: String,
    income: String,

    location: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      maxlength: 500,
    },

    // ✅ UPDATED PHOTO FIELD
    photos: {
      type: [String], // array of URLs
      validate: {
        validator: function (val) {
          return val.length <= 5;
        },
        message: "Maximum 5 photos allowed",
      },
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
