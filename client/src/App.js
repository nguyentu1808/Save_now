import React, { useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/auth/login';
import SignUp from './components/auth/register';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/auth/profile';
import { useState } from 'react';
import Home from './app/home';
import Contribute from './app/contribute';

import RescueRequestList from './app/request';
import InfoRequest from './app/inforequest';
import ItemPage from './app/item';
import ListUser from './app/listuser';
import InfoUser from './app/infouser';
import Warehouse from './app/warehouse';
import Statements from './app/statements';
import Logs from './admin/pages/log';

import AdminItemPage from './admin/pages/AdminItem';
import AdminWarehouse from './admin/pages/AdminWarehouse';
import AdminListStaff from './admin/pages/AdminStaff';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminStatements from './admin/pages/AdminStatement';
import AdminContribute from './admin/pages/AdminContribute';
import AdminInfoRequest from './admin/pages/AdminInforRequest';
import AdminRescueRequestList from './admin/pages/AdminRequest';

import AdminWarehouseItemPage from './warehouseAdmin/pages/WarehouseItem';
import AdminWarehouseListStaff from './warehouseAdmin/pages/WarehouseStaff';
import WarehouseDashboard from './warehouseAdmin/pages/WarehouseDashboard';
import AdminWRescueRequestList from './warehouseAdmin/pages/WarehouseRequest';
import AdminWInfoRequest from './warehouseAdmin/pages/WarehouseInforRequest';
import AdminWStatements from './warehouseAdmin/pages/WarehouseStatement';
import AdminWContribute from './warehouseAdmin/pages/WarehouseContribute';

import StaffItemPage from './staff/pages/StaffItem';
import StaffDashboard from './staff/pages/StaffDashboard';
import StaffInfoRequest from './staff/pages/StaffInforRequest';
import StaffRescueRequestList from './staff/pages/StaffRequest';
import StaffStatements from './staff/pages/StaffStatement';
import StaffContribute from './staff/pages/StaffContribute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Lấy role từ localStorage
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Xóa role khi đăng xuất
    setUser(null);
  };
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/profile"
            element={user ? <Profile handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/request" element={<RescueRequestList />} />
          <Route path="/inforequest/:requestId" element={<InfoRequest />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/listuser" element={<ListUser />} />
          <Route path="/infouser/:id" element={<InfoUser />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/statement" element={<Statements />} />
          <Route path="/log" element={<Logs />} />
          //Admin
          <Route path="/admin/item" element={<AdminItemPage />} />
          <Route path="/admin/staff" element={<AdminListStaff />} />
          <Route path="/admin/statement" element={<AdminStatements />} />
          <Route path="/admin/warehouse" element={<AdminWarehouse />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/statement" element={<AdminStatements />} />
          <Route path="/admin/contribute" element={<AdminContribute />} />
          <Route path="/admin-request/inforequest/:requestId" element={<AdminInfoRequest />} />
          <Route path="/admin-request" element={<AdminRescueRequestList />} />
          //adminWarehouse
          <Route path="/adminWarehouse/item" element={<AdminWarehouseItemPage />} />
          <Route path="/adminWarehouse/staff" element={<AdminWarehouseListStaff />} />
          <Route path="/warehouse-dashboard" element={<WarehouseDashboard />} />
          <Route path="/adminW-request" element={<AdminWRescueRequestList />} />
          <Route path="/adminW/statement" element={<AdminWStatements />} />
          <Route path="/adminW/contribute" element={<AdminWContribute />} />
          <Route path="/adminW-request/inforequest/:requestId" element={<AdminWInfoRequest />} />
          //Staff
          <Route path="/staff/item" element={<StaffItemPage />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/request" element={<StaffRescueRequestList />} />
          <Route path="/staff/infoRequest/:requestId" element={<StaffInfoRequest />} />
          <Route path="/staff/request" element={<StaffRescueRequestList />} />
          <Route path="/staff/statement" element={<StaffStatements />} />
          <Route path="/staff/contribute" element={<StaffContribute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
