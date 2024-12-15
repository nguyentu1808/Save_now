import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // Khởi tạo navigate từ react-router-dom

  const handleNavigate = (path) => {
    navigate(path); // Điều hướng đến đường dẫn tương ứng
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img
          src="/assets/logo.png"
          alt="SaveNow Logo"
          style={styles.logoImage}
          onClick={() => handleNavigate('/admin-dashboard')} // Điều hướng về trang chủ khi nhấn vào logo
        />
      </div>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/admin/item')} style={styles.navLink}>
              Vật Phẩm
            </button>
          </li>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/admin/statement')} style={styles.navLink}>
              Sao kê
            </button>
          </li>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/admin/staff')} style={styles.navLink}>
              Nhân viên
            </button>
          </li>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/admin/warehouse')} style={styles.navLink}>
              Kho hàng
            </button>
          </li>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/admin-request')} style={styles.navLink}>
              Yêu cầu tiếp tế
            </button>
          </li>
          <li style={styles.navItem}>
            <button onClick={() => handleNavigate('/log')} style={styles.navLink}>
              Lịch sử
            </button>
          </li>
        </ul>
      </nav>

      <div style={styles.authButtons}>
        <button onClick={() => handleNavigate('/profile')} style={styles.authLink}>
          Tài khoản
        </button>
        <button onClick={logout} style={styles.authLink}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed', 
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#E4E3E3',
    zIndex: 1000, 
  },
  logo: {
    flex: 1,
  },
  logoImage: {
    height: '30px',
    cursor: 'pointer',
  },
  nav: {
    flex: 2,
    display: 'flex',
    justifyContent: 'center',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 20px',
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  authButtons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  authLink: {
    color: '#333',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Header;