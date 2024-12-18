const bcrypt = require('bcrypt');
const db = require('../config/db');
const { post } = require('../routes/authRoutes');
const { addLogAction } = require('./logsController');

//Lấy danh sách vật phẩm theo kho
const getItems = async (req, res) => {
  const userId = req.user.id;
  const [userData] = await db.query('SELECT warehouse_id FROM users WHERE id = ?', [userId]);

  if (userData.length === 0) {
    return res.status(403).send({ success: false, message: 'Employee not in any warehouse' });
  }

  const warehouseId = userData[0].warehouse_id;
  try {
    const query = `
        SELECT *
        FROM items
        WHERE warehouse_id = ?
      `;
    const [rows] = await db.execute(query, [warehouseId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching items' });
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

    const logData = {
      user_id: req.user.id,
      action: 'update',
      table_name: 'items',
      record_id: itemId,
    };
    await addLogAction(logData);

    res.status(200).send({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error updating item', error });
  }
};

//Thêm vật phẩm
const addItem = async (req, res) => {
  const { name, quantity, unit, expiration_date, category, contributor_name } = req.body;
  const userId = req.user.id;
  const [userData] = await db.query('SELECT warehouse_id FROM users WHERE id = ?', [userId]);

  if (userData.length === 0) {
    return res.status(403).send({ success: false, message: 'Employee not in any warehouse' });
  }

  const warehouse_id = userData[0].warehouse_id;
  if (!name || !quantity || !unit || !category || !warehouse_id || !contributor_name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const query = `
        INSERT INTO items (name, quantity, unit, expiration_date, category, warehouse_id , contributor_name, is_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `;
    const [result] = await db.execute(query, [
      name,
      quantity,
      unit,
      expiration_date,
      category,
      warehouse_id,
      contributor_name,
    ]);

    const data = {
      user_id: req.user.id,
      action: 'insert',
      table_name: 'items',
      record_id: result.insertId,
    };
    await addLogAction(data);

    res.status(201).json({ success: true, message: 'Item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding item' });
  }
};

// Xóa vật phẩm
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM items WHERE id = ?';
    await db.execute(query, [id]);

    const logData = {
      user_id: req.user.id,
      action: 'delete',
      table_name: 'items',
      record_id: id,
    };
    await addLogAction(logData);

    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting item' });
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

      const logData = {
        user_id: req.user.id,
        action: 'update',
        table_name: 'items',
        record_id: itemId,
      };
      await addLogAction(logData);

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
  getItems,
  addItem,
  deleteItem,
  updateItem,
  useItem,
  getRequestByLocation,
};
