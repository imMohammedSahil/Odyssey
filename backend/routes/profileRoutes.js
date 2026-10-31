console.log("✅ Profile routes loaded");

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadProfile");
const User = require("../models/User");

// ✅ UPLOAD PROFILE PHOTO
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const studentId = req.body?.studentId;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID missing" });
    }

    console.log("✅ Upload route hit");
    console.log("👉 studentId received:", studentId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const photoPath = `/uploads/profile/${req.file.filename}`;

    let user = await User.findOne({ studentId });

    if (!user) {
      user = new User({
        studentId: studentId,
        name: studentId   // required by schema
      });
    }

    console.log("🧠 User before save:", user);

    user.profilePhoto = photoPath;
    await user.save();

    res.json({ success: true, photoPath });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


// ✅ GET PROFILE PHOTO
router.get("/:studentId", async (req, res) => {
  try {
    const user = await User.findOne({
      studentId: req.params.studentId,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User fetch failed" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const {
      studentId,
      phone,
      collegeEmail,
      department,
      year,
      section,
      bio
    } = req.body;

    const user = await User.findOneAndUpdate(
      { studentId },
      { phone, collegeEmail, department, year, section, bio },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;