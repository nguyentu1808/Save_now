const express = require('express');
const jwt = require('jsonwebtoken');
const {
  getRequestByStatus,
  addRequest,
  updateStatus,
  getItemUsedByRequest,
  AddArticle,
  GetArticle,
} = require('../controllers/requestController');

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

const router = express.Router();
// Định tuyến cho API lấy danh sách yêu cầu cứu trợ theo trạng thái
router.get('/requests', getRequestByStatus);

// Định tuyến cho API thêm yêu cầu cứu trợ
router.post('/addRequest', addRequest);

// Định tuyến cho API cập nhật trạng thái yêu cầu cứu trợ
router.put('/requests/:id/status', authenticateToken, updateStatus);

// Định tuyến cho API lấy danh sách item đã sử dụng theo areaId
router.get('/items/request/:requestId', getItemUsedByRequest);

//Lấy danh sách bài báo
router.get('/article/:requestId', authenticateToken, GetArticle);

//Thêm danh sách bài báo
router.post('/addarticle/:requestId', authenticateToken, AddArticle);

module.exports = router;
