const db = require('../config/db');
const bcrypt = require("bcrypt");

const getRequestByStatus = async(req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const query = "SELECT * FROM relief_areas WHERE status = ?";
  
  try {
    const [results] = await db.query(query, [status]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

const addRequest = async (req, res) => {
  const { name, description, contact, location } = req.body;

  if (!name || !description || !contact || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO relief_areas (name, status, description, priority_level, contact, created_at, updated_at, location)
    VALUES (?, "pending", ?, 0, ?, NOW(), NOW(), ?)
  `;
  const values = [name, description, contact, location]; // Chỉ truyền các giá trị cần thiết

  try {
    // Sử dụng await để thực hiện truy vấn
    const [results] = await db.query(query, values);
    res.json({
      message: "Relief request added successfully",
      id: results.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};


const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const validStatuses = ["pending", "active", "done", "cancel"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const query =
    "UPDATE relief_areas SET status = ?, updated_at = NOW() WHERE id = ?";

  try {
    // Sử dụng await để thực hiện truy vấn
    const [results] = await db.query(query, [status, id]);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Relief request not found" });
    }

    res.json({ message: "Status updated successfully" });
    await fetch("http://localhost:5001/adLogs//activity-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: req.user.id,
        action: 'update',
        table_name: 'relief_areas',
        record_id: id,
      })
    });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};


const getItemUsedByRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    // Truy vấn items theo area_id và is_used = 1
    const [items] = await db.query(
      "SELECT * FROM items WHERE is_used = 1 AND area_id = ?",
      [requestId]
    );

    // Trả về kết quả
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy vấn dữ liệu" });
  }
};

//Lấy danh sách bài báo
async function GetArticle(req, res) {
  const { requestId } = req.params;
  try {
    const query = `
      SELECT name, url FROM article where area_id = ?
    `;
    const [rows] = await db.execute(query,[requestId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching request" });
  }
}


//Thêm danh sách bài báo
const AddArticle = async (req, res) => {
  const {
    name,
    url,
  } = req.body;
  const { requestId } = req.params;
  if (
    !name ||
    !url ||
    !requestId
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO article (name, url, area_id)
      VALUES (?, ?, ?)
    `;
    await db.execute(query, [
      name,
      url,
      requestId,
    ]);
    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding item"});
  }
};

module.exports = {getRequestByStatus, addRequest, updateStatus, getItemUsedByRequest, GetArticle, AddArticle}
