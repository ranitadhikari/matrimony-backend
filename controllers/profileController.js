const Profile = require("../models/Profile");
// ✅ FIXED CREATE PROFILE
exports.createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map((file) => file.path);
    }

    // 1. Extract fields from req.body
    const {
      fullName, age, gender, height, religion, caste,
      maritalStatus, education, occupation, income, location, about,
      hasDisability, disabilityDetails, email, phone
    } = req.body;

    // 2. Create the profile with the correct structure
    const profile = await Profile.create({
      fullName,
      age,
      gender,
      height,
      religion,
      caste,
      maritalStatus,
      education,
      occupation,
      income,
      location,
      about,
      user: req.user.id,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      photos: photoUrls,
      // ✅ Map flat fields to nested object
      disability: {
        hasDisability: hasDisability === 'true',
        details: disabilityDetails || ''
      }
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("CREATE PROFILE ERROR 👉", error);
    res.status(500).json({ message: error.message });
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
// ✅ FIXED UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update standard fields
    const fieldsToUpdate = [
      'fullName', 'age', 'gender', 'height', 'religion', 'caste',
      'maritalStatus', 'education', 'occupation', 'income', 'location', 'about',
      'email', 'phone'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // ✅ Update nested disability object
    if (req.body.hasDisability !== undefined) {
      profile.disability = {
        hasDisability: req.body.hasDisability === 'true',
        details: req.body.disabilityDetails || profile.disability?.details || ''
      };
    }

    // Update photos if new ones uploaded
    if (req.files && req.files.length > 0) {
      profile.photos = req.files.map((file) => file.path);
    }

    await profile.save();
    res.json({ message: "Profile updated successfully", profile });
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