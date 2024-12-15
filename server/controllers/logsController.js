const bcrypt = require('bcrypt');
const db = require('../config/db');

// API tạo log hoạt động
const addLog = async (req, res) => {
    try {
        const { user_id, action, table_name, record_id } = req.body;

        // Validate dữ liệu đầu vào
        if (!user_id || !action || !table_name || !record_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Thiếu thông tin bắt buộc'
            });
        }

        // Query để insert log
        const query = `
            INSERT INTO logs 
            (user_id, action, table_name, record_id, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        `;

        // Thực hiện query
        const [result] = await db.query(query, [user_id, action, table_name, record_id]);

        // Trả về kết quả
        res.status(201).json({
            status: 'success',
            message: 'Đã lưu log thành công',
            data: {
                id: result.insertId,
                user_id,
                action,
                table_name,
                record_id,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// API lấy danh sách log
const getLogs = async (req, res) => {
    try {
        const { user_id, from_date, to_date, action } = req.query;
        let query = 'SELECT * FROM logs WHERE 1=1';
        let params = [];

        // Thêm điều kiện tìm kiếm
        if (user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        }
        if (action) {
            query += ' AND action = ?';
            params.push(action);
        }
        if (from_date) {
            query += ' AND created_at >= ?';
            params.push(from_date);
        }
        if (to_date) {
            query += ' AND created_at <= ?';
            params.push(to_date);
        }

        query += ' ORDER BY created_at DESC';

        // Thực hiện query
        const [results] = await db.query(query, params);

        // Trả về kết quả
        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server',
            error: error.message
        });
    }
};

module.exports = { addLog, getLogs };
