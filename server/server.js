const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminWarehouseRoutes = require('./routes/adminWarehouseRoutes')
const adminRoutes = require('./routes/adminRoutes')
const staffRoutes = require('./routes/staffRoutes')
const statementRoutes = require('./routes/statementRoutes')
const requestRoutes = require('./routes/requestRoutes')
const logRoutes = require('./routes/logsRoutes')
const db = require('./config/db');

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


app.listen(5001, () => {
console.log('Server running on port 5001');
});


