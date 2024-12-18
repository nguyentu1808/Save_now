const db = require('../config/db');
const bcrypt = require('bcrypt');
const { addLogAction } = require('./logsController');

// Lấy danh sách kho
const getWarehouses = async (req, res) => {
  try {
    const query = 'SELECT id, name, location, capacity FROM warehouses';
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching warehouses' });
  }
};

// Sửa thông tin kho theo ID
const updateWarehouse = async (req, res) => {
  const { name, location, capacity } = req.body;
  const warehouseId = req.params.id;

  // Kiểm tra xem có đủ thông tin cần thiết không
  if (!name || !location || !capacity) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Cập nhật kho trong cơ sở dữ liệu
    const query = `
        UPDATE warehouses 
        SET name = ?, location = ?, capacity = ? 
        WHERE id = ?`;
    const [result] = await db.execute(query, [name, location, capacity, warehouseId]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Warehouse updated successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error updating warehouse' });
  }
};

// Xóa kho dựa trên ID
const deleteWarehouse = async (req, res) => {
  const { id } = req.params;

  try {
    // Kiểm tra nếu ID kho tồn tại
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID kho không hợp lệ' });
    }

    // Xóa kho khỏi cơ sở dữ liệu
    const query = 'DELETE FROM warehouses WHERE id = ?';
    const result = await db.execute(query, [id]);

    // Kiểm tra nếu không có kho nào bị xóa
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kho không tồn tại' });
    }

    // Trả về kết quả thành công
    res.status(200).json({ success: true, message: 'Kho đã được xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa kho' });
  }
};

// Lấy danh sách nhân viên theo warehouse_id
const getEmployeesByWarehouse = async (req, res) => {
  const { warehouse_id } = req.params;
  try {
    const query = `
      SELECT u.id, u.user_name, u.email, u.full_name, u.role
      FROM users u
      WHERE u.warehouse_id = ?
    `;
    const [rows] = await db.execute(query, [warehouse_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching employees' });
  }
};

// API thêm kho mới
const addWarehouse = async (req, res) => {
  const { name, location, capacity } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !location || !capacity) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Chèn dữ liệu vào bảng "warehouses"
    const query = `
      INSERT INTO warehouses (name, location, capacity) 
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [name, location, capacity]);

    // Phản hồi thành công
    return res.status(201).json({
      success: true,
      message: 'Warehouse added successfully',
      warehouseId: result.id, // Trả về ID của kho mới thêm
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error adding warehouse' });
  }
};

// Thêm nhân viên
const addEmployee = async (req, res) => {
  const { user_name, email, password, full_name, role, warehouse_id } = req.body;
  if (!user_name || !email || !password || !full_name || !role || !warehouse_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
    const query = `
      INSERT INTO users (user_name, email, password, full_name, role, warehouse_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [user_name, email, hashedPassword, full_name, role, warehouse_id]);
    res.status(201).json({ success: true, message: 'Employee added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding employee' });
  }
};

// Xóa nhân viên
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.execute(query, [id]);
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting employee' });
  }
};

// PUT: Sửa thông tin nhân viên
const updateEmployee = async (req, res) => {
  try {
    const { user_name, email, full_name, role } = req.body;
    const employeeId = req.params.id;

    if (!user_name && !email && !full_name && !role) {
      return res.status(400).send({
        success: false,
        message: 'At least one field must be updated',
      });
    }

    const [employeeData] = await db.query('SELECT id FROM users WHERE id = ?', employeeId);

    if (employeeData.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Employee not found in your warehouse',
      });
    }

    await db.query(
      'UPDATE users SET user_name = COALESCE(?, user_name), email = COALESCE(?, email), full_name = COALESCE(?, full_name), role = COALESCE(?, role) WHERE id = ?',
      [user_name, email, full_name, role, employeeId]
    );

    res.status(200).send({ success: true, message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error updating employee', error });
  }
};

//Lấy danh sách vật phẩm theo kho
const getItemsByWarehouse = async (req, res) => {
  const { warehouse_id } = req.params;
  try {
    const query = `
      SELECT *
      FROM items
      WHERE warehouse_id = ?
    `;
    const [rows] = await db.execute(query, [warehouse_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching items' });
  }
};
// Xóa vật phẩm
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM items WHERE id = ?';
    await db.execute(query, [id]);
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting item' });
  }
};

// PUT: Sửa thông tin vật phẩm
const updateItem = async (req, res) => {
  try {
    const { name, quantity, unit, expiration_date, category } = req.body;
    const itemId = req.params.id;

    if (!name && !quantity && !unit && !expiration_date && !category) {
      return res.status(400).send({
        success: false,
        message: 'At least one field must be updated',
      });
    }

    const [itemData] = await db.query('SELECT id FROM items WHERE id = ?', itemId);

    if (itemData.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Item not found in your warehouse',
      });
    }

    await db.query(
      'UPDATE items SET name = COALESCE(?, name), quantity = COALESCE(?, quantity), unit = COALESCE(?, unit), expiration_date = COALESCE(?, expiration_date), category = COALESCE(?, category) WHERE id = ?',
      [name, quantity, unit, expiration_date, category, itemId]
    );

    const data = {
      user_id: req.user.id,
      action: 'update',
      table_name: 'items',
      record_id: itemId,
    };
    const logInfo = await addLogAction(data);

    res.status(200).send({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error updating item', error });
  }
};

//Thêm vật phẩm
const addItem = async (req, res) => {
  const { name, quantity, unit, expiration_date, category, warehouse_id, contributor_name } =
    req.body;
  if (!name || !quantity || !unit || !category || !warehouse_id || !contributor_name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO items (name, quantity, unit, expiration_date, category, warehouse_id , contributor_name, is_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    await db.execute(query, [
      name,
      quantity,
      unit,
      expiration_date,
      category,
      warehouse_id,
      contributor_name,
    ]);
    res.status(201).json({ success: true, message: 'Item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding item' });
  }
};

//Gửi vật phẩm
const useItem = async (req, res) => {
  const itemId = req.params.id;
  const { areaId, quantity } = req.body;
  const userId = req.user.id;

  const [itemData] = await db.query('SELECT * FROM items WHERE id = ?', itemId);

  if (!itemData) {
    return res.status(404).send({
      success: false,
      message: 'Item not found in your warehouse',
    });
  }

  if (itemData[0].is_used) {
    return res.status(400).json({ message: 'Sản phẩm này đã được sử dụng.' });
  }

  if (quantity === itemData[0].quantity) {
    try {
      await db.query(
        'UPDATE items SET area_id = COALESCE(?, area_id), user_id = COALESCE(?, user_id), is_used = 1 WHERE id = ?',
        [areaId, userId, itemId]
      );

      res.status(200).send({ success: true, message: 'Item updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: 'Error updating item', error });
    }
  } else if (quantity < itemData[0].quantity) {
    try {
      // Cập nhật số lượng còn lại cho sản phẩm hiện tại
      const remainingQuantity = itemData[0].quantity - quantity;

      await db.query('UPDATE items SET quantity = ? WHERE id = ?', [remainingQuantity, itemId]);

      // Tạo sản phẩm mới với số lượng sử dụng và is_used = true
      await db.query(
        'INSERT INTO items (name, quantity, unit, expiration_date, warehouse_id, area_id, contributor_name, category, user_id, is_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          itemData[0].name, // Tên sản phẩm từ itemData
          quantity, // Số lượng sử dụng
          itemData[0].unit,
          itemData[0].expiration_date,
          itemData[0].warehouse_id,
          areaId, // Khu vực truyền vào
          itemData[0].contributor_name,
          itemData[0].category,
          userId, // Người dùng truyền vào
          1, // is_used = true
        ]
      );

      res.status(200).send({
        success: true,
        message: 'Item partially used and split successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error updating item and creating new record',
        error,
      });
    }
  } else {
    // Trường hợp số lượng truyền vào không hợp lệ
    console.log(quantity);
    res.status(400).send({
      success: false,
      message: 'Invalid quantity: exceeds available stock',
    });
  }
};

//Lấy danh sách yêu cầu cứu trợ theo khu vực
async function getRequestByLocation(req, res) {
  const { location } = req.params;
  try {
    const query = `
      SELECT *
      FROM relief_areas
      WHERE location = ? AND status = 'active'
    `;
    const [rows] = await db.execute(query, [location]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching request' });
  }
}

module.exports = {
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  addWarehouse,
  getEmployeesByWarehouse,
  deleteEmployee,
  addEmployee,
  updateEmployee,
  getItemsByWarehouse,
  deleteItem,
  updateItem,
  addItem,
  useItem,
  getRequestByLocation,
};
