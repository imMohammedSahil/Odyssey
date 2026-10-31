const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    const studentId = req.body.studentId || "user";

    cb(null, studentId + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // allow only images
  if (!file.mimetype.startsWith("image")) {
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;