const db = require('../config/db');
const bcrypt = require('bcrypt');

const getItemUsedByLocation = async (req, res) => {
  const { location } = req.params; // Lấy giá trị location từ URL

  try {
    // Truy vấn bảng `areas` để tìm các area_id tương ứng với location
    const [areas] = await db.query('SELECT id FROM relief_areas WHERE location = ?', [location]);

    if (areas.length === 0) {
      return res.status(404).json({
        message: 'Không tìm thấy yêu cầu cứu trợ nào cho location này',
      });
    }

    // Lấy danh sách area_id
    const areaIds = areas.map(area => area.id);

    // Truy vấn items theo area_id và is_used = 1
    const [items] = await db.query('SELECT * FROM items WHERE is_used = 1 AND area_id IN (?)', [
      areaIds,
    ]);

    // Trả về kết quả
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi truy vấn dữ liệu' });
  }
};

//Lấy danh sách sao kê
async function GetStatement(req, res) {
  try {
    const query = `
      SELECT name, url FROM statements
    `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching request' });
  }
}

//Thêm danh sách sao kê
const AddStatement = async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO statements (name, url)
      VALUES (?, ?)
    `;
    await db.execute(query, [
      name,
      // user_id,
      url,
    ]);
    res.status(201).json({ success: true, message: 'Item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding item' });
  }
};

module.exports = {
  getItemUsedByLocation,
  AddStatement,
  GetStatement,
};
