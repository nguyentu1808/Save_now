const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({ success: false, message: 'fields not required' });
    }
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: 'Email used' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa password
    const data = await db.query('INSERT INTO users(user_name,password,email,role) VALUES (?,?,?,?)', [email, hashedPassword, email, 'staff']);
    
    if (!data) {
      return res.status(404).send({ success: false, message: 'Error insert query' });
    }
    res.status(201).send({ success: true, message: 'New user created' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error api register', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({ success: false, message: 'fields not required' });
    }

    const data = await db.query('SELECT id, password, role FROM users WHERE email = ?', [email]);
    if (data[0].length === 0) {
      return res.status(404).send({ success: false, message: 'Email does not exist' });
    }


     const user = data[0][0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ success: false, message: 'Invalid email or password' }); // Thông báo chung
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    
    res.status(200).send({
      success: true,
      message: 'Login successfully',
      token,
      role: user.role, 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error api login', error });
  }
};

module.exports = { register, login };
