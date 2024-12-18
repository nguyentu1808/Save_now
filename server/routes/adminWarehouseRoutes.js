const express = require('express');
const jwt = require('jsonwebtoken');
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getItems,
  addItem,
  useItem,
  updateItem,
  deleteItem,
  getRequestByLocation,
} = require('../controllers/adminWarehouseController');
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

router.get('/employees', authenticateToken, getEmployees); // Lấy danh sách nhân viên
router.post('/addEmployee', authenticateToken, addEmployee); // Thêm nhân viên
router.put('/employees/:id', authenticateToken, updateEmployee); // Sửa thông tin nhân viên
router.delete('/deleteEmployee/:id', authenticateToken, deleteEmployee); //Xoá nhân viên

//Lấy thông tin vật phẩm theo kho
router.get('/items', authenticateToken, getItems);

// Thêm vật phẩm vào kho theo id
router.post('/addItem', authenticateToken, addItem);

// Xóa vật phẩm
router.delete('/deleteItem/:id', authenticateToken, deleteItem);

// Sửa thông tin vật phẩm
router.put('/item/:id', authenticateToken, updateItem);

//Sử dụng vật phẩm
router.post('/useItem/:id', authenticateToken, useItem);

//Lấy thông tin yêu cầu theo khu vực
router.get('/request/:location', authenticateToken, getRequestByLocation);

module.exports = router;
