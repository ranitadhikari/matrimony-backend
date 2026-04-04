const express = require("express");
const router = express.Router();


const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
  searchProfiles,
} = require("../controllers/profileController");

// ✅ max 5 photos upload during profile creation
router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.array("photos", 5)(req, res, function (err) {
      if (err) {
        console.log("MULTER ERROR 👉", err);
        return res.status(400).json({ message: err.message });
      }

      console.log("AFTER MULTER FILES 👉", req.files); // 🔥 important

      next();
    });
  },
  createProfile
);
// GET MY PROFILE
router.get("/me", protect, getMyProfile);

// UPDATE
router.put("/", protect, upload.array("photos", 5), updateProfile);

// DELETE
router.delete("/", protect, deleteProfile);

router.get("/search", protect, searchProfiles);

module.exports = router;