import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import AddSpendingStats from '../../components/addstatement';

const apiUrl = process.env.REACT_APP_API_URL;

const AdminWStatements = () => {
  const [selectedTab, setSelectedTab] = useState('spendingStats');
  const [statements, setStatements] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedArea, setSelectedArea] = useState('Miền Bắc');

  const areaOptions = [
    'Miền Bắc',
    'Miền Trung',
    'Miền Nam',
    'Tây Nguyên',
    'Đồng bằng sông Cửu Long',
  ];

  const handleAreaChange = e => {
    setSelectedArea(e.target.value);
  };

  useEffect(() => {
    fetchItems(selectedArea);
  }, [selectedArea]);

  const fetchItems = async location => {
    try {
      const response = await fetch(`${apiUrl}/statement/items/${location}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchStatement();
  }, []);

  //Hàm lấy danh sách sao kê
  const fetchStatement = async () => {
    try {
      const response = await fetch(`${apiUrl}/statement/statements`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT token for authentication
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('API response:', data);
      setStatements(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTabClick = tab => {
    setSelectedTab(tab);
  };

  const handleAddStatements = newStatement => {
    setStatements([...statements, newStatement]);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button
            onClick={() => handleTabClick('spendingStats')}
            style={{
              ...styles.navButton,
              ...(selectedTab === 'spendingStats' ? styles.activeTab : {}),
            }}
          >
            Danh sách sao kê
          </button>
          <button
            onClick={() => handleTabClick('itemStats')}
            style={{
              ...styles.navButton,
              ...(selectedTab === 'itemStats' ? styles.activeTab : {}),
            }}
          >
            Bảng Thống Kê Vật Phẩm
          </button>
        </nav>

        <div style={styles.content}>
          {selectedTab === 'spendingStats' && (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>STT</th>
                    <th style={styles.th}>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {statements.map((stat, index) => (
                    <tr key={stat.id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <a href={stat.url} style={styles.link}>
                          {stat.name}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AddSpendingStats onAdd={handleAddStatements} />
            </div>
          )}

          {selectedTab === 'itemStats' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  Khu vực sử dụng:
                  <select value={selectedArea} onChange={handleAreaChange}>
                    {areaOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Tên</th>
                      <th style={styles.th}>Số lượng</th>
                      <th style={styles.th}>Hạn sử dụng</th>
                      <th style={styles.th}>Danh mục</th>
                      <th style={styles.th}>Người đóng góp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td style={styles.td}>{item.name}</td>
                        <td style={styles.td}>{item.quantity}</td>
                        <td style={styles.td}>
                          {item.expiration_date
                            ? new Date(item.expiration_date).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </td>
                        <td style={styles.td}>{item.category}</td>
                        <td style={styles.td}>{item.contributor_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    margin: 'auto',
    paddingTop: '80px',
    maxWidth: '1200px',
    paddingBottom: '50px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '50px',
  },
  navButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '20px',
    textDecoration: 'none',
    color: '#333',
    marginRight: '20px',
  },
  activeTab: {
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  content: {
    marginTop: '20px',
  },
  tableContainer: {
    height: 'calc(8 * 40px + 160px)', // Chiều cao của bảng
    overflowY: 'auto', // Thanh cuộn dọc
    border: '1px solid #ccc', // Thêm đường viền cho container
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'left',
  },
  addButton: {
    position: 'fixed',
    bottom: '150px',
    right: '100px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
  },
  select: {
    marginButtom: '50px',
  },
};

export default AdminWStatements;
