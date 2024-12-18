const express = require('express');
const {
  getItemUsedByLocation,
  GetStatement,
  AddStatement,
} = require('../controllers/statementController');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ success: false, message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).send({ success: false, message: 'Invalid token' });
    }
    req.user = user; // Lưu thông tin người dùng từ token
    next();
  });
};

// Lấy vật phẩm đã sử dụng theo khu vực (không yêu cầu đăng nhập)
router.get('/items/:location', getItemUsedByLocation);

//Lấy danh sách sao kê
router.get('/statements', GetStatement);

//Thêm danh sách sao kê
router.post('/addstatements', authenticateToken, AddStatement);

module.exports = router;
