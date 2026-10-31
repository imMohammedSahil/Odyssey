const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    filePath: req.file.filename,
  });
});

module.exports = router;