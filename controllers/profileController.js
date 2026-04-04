const Profile = require("../models/Profile");
exports.createProfile = async (req, res) => {
  try {
    console.log("BODY 👉", req.body);       // ✅ debug
    console.log("FILES 👉", req.files);     // ✅ debug

    const existing = await Profile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    let photoUrls = [];

    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map((file) => file.path);
    }

    const profile = await Profile.create({
      ...req.body,
      photos: photoUrls,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
  console.error("FULL ERROR 👉", error);

  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
};
// ✅ GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // update fields
    Object.keys(req.body).forEach((key) => {
      profile[key] = req.body[key];
    });

    // update photos if new uploaded
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);

      // replace OR append (your choice)
      profile.photos = newPhotos; // replace
      // profile.photos.push(...newPhotos); // append
    }

    await profile.save();

    res.json({
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    await Profile.deleteOne({ user: req.user.id });

    res.json({
      message: "Profile deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔍 SEARCH PROFILES
exports.searchProfiles = async (req, res) => {
  try {
    const {
      minAge,
      maxAge,
      gender,
      religion,
      caste,
      maritalStatus,
      location,
      hasDisability,
    } = req.query;

    let query = {
       // only approved profiles
    };

    // age filter
    if (minAge && maxAge) {
      query.age = { $gte: minAge, $lte: maxAge };
    }

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (caste) query.caste = caste;
    if (maritalStatus) query.maritalStatus = maritalStatus;
    if (location) query.location = location;

    // disability filter
    if (hasDisability !== undefined) {
      query["disability.hasDisability"] = hasDisability === "true";
    }

    const profiles = await Profile.find(query).populate("user", "name email");

    res.json({
      count: profiles.length,
      profiles,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};