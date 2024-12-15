const express = require('express');
const jwt = require('jsonwebtoken');
const {
  getWarehouses,
  deleteWarehouse,
  getEmployeesByWarehouse,
  addEmployee,
  deleteEmployee,
  updateWarehouse,
  addWarehouse,
  updateEmployee,
  getItemsByWarehouse,
  deleteItem,
  updateItem,
  addItem,
  useItem,
  getRequestByLocation,
} = require('../controllers/adminController');

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

// Lấy danh sách kho
router.get('/warehouses', authenticateToken, getWarehouses);

//Sửa thông tin kho
router.put('/updateWarehouse/:id', authenticateToken, updateWarehouse);

// Xoá kho
router.delete('/deleteWarehouse/:id', deleteWarehouse);

// Thêm kho
router.post('/addWarehouse', authenticateToken, addWarehouse);

// Lấy danh sách nhân viên theo warehouse_id
router.get('/warehouses/:warehouse_id/employees', authenticateToken, getEmployeesByWarehouse);

// Thêm nhân viên vào kho theo id
router.post('/warehouses/employees', authenticateToken, addEmployee);

// Xóa nhân viên
router.delete('/deleteEmployee/:id', authenticateToken, deleteEmployee);

// Sửa thông tin nhân viên
router.put('/employee/:id', authenticateToken, updateEmployee); 

//Lấy thông tin vật phẩm theo kho
router.get('/items/:warehouse_id', authenticateToken, getItemsByWarehouse);

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
