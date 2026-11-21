console.log("✅ Profile routes loaded");

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const upload = require("../middleware/uploadProfile");
const User = require("../models/User");

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many profile requests, please try again later." }
});

router.use(profileLimiter);

function sanitizeStudentId(val) {
  if (typeof val !== "string") return null;
  const clean = val.trim();
  if (!clean || clean.includes("$") || clean.includes(".")) return null;
  return clean;
}

// ✅ UPLOAD PROFILE PHOTO
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const studentId = sanitizeStudentId(req.body?.studentId);

    if (!studentId) {
      return res.status(400).json({ error: "Valid Student ID required" });
    }

    console.log("✅ Upload route hit");
    console.log("👉 studentId received:", studentId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const photoPath = `/uploads/profile/${req.file.filename}`;

    let user = await User.findOne({ studentId: { $eq: studentId } });

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
    const studentId = sanitizeStudentId(req.params.studentId);
    if (!studentId) {
      return res.status(400).json({ error: "Valid Student ID required" });
    }

    const user = await User.findOne({
      studentId: { $eq: studentId },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User fetch failed" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const studentId = sanitizeStudentId(req.body?.studentId);
    if (!studentId) {
      return res.status(400).json({ error: "Valid Student ID required" });
    }

    const {
      phone,
      collegeEmail,
      department,
      year,
      section,
      bio
    } = req.body;

    const updateFields = {};
    if (typeof phone === "string") updateFields.phone = phone.trim();
    if (typeof collegeEmail === "string") updateFields.collegeEmail = collegeEmail.trim();
    if (typeof department === "string") updateFields.department = department.trim();
    if (typeof year === "string") updateFields.year = year.trim();
    if (typeof section === "string") updateFields.section = section.trim();
    if (typeof bio === "string") updateFields.bio = bio.trim();

    const user = await User.findOneAndUpdate(
      { studentId: { $eq: studentId } },
      { $set: updateFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
