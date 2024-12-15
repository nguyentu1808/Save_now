const express = require("express");
const jwt = require("jsonwebtoken");
const { addLog, getLogs } = require("../controllers/logsController");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], "secretkey", (err, user) => {
    if (err) {
      return res.status(403).send({ success: false, message: "Invalid token" });
    }
    req.user = user; // Lưu thông tin người dùng từ token
    next();
  });
};

const router = express.Router();

router.post("/activity-logs", addLog);
router.get("/activity-logs", authenticateToken, getLogs);

module.exports = router;