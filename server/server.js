const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminWarehouseRoutes = require('./routes/adminWarehouseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const statementRoutes = require('./routes/statementRoutes');
const requestRoutes = require('./routes/requestRoutes');
const logRoutes = require('./routes/logsRoutes');
const db = require('./config/db');
require('dotenv').config({ path: './main.env' });

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/adminW', adminWarehouseRoutes);
app.use('/admin', adminRoutes);
app.use('/staff', staffRoutes);
app.use('/statement', statementRoutes);
app.use('/adRequest', requestRoutes);
app.use('/adLogs', logRoutes);

// Giao diện
app.use(express.static('build'));
const CLIENT_PATH = 'build/index.html';
app.get('*', (req, res) => {
  res.sendFile(CLIENT_PATH, { root: __dirname });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://fall2024c8g5.int3306.freeddns.org`);
});
