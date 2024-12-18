import React, { useState, useEffect } from 'react';
import Layout from '../layout';

const apiUrl = process.env.REACT_APP_API_URL;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    user_id: '',
    from_date: '',
    to_date: '',
    action: '',
  });
  const recordsPerPage = 6;

  // Fetch logs từ API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Thêm các filter vào params
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.from_date) params.append('from_date', filters.from_date);
      if (filters.to_date) params.append('to_date', filters.to_date);
      if (filters.action) params.append('action', filters.action);

      const response = await fetch(`${apiUrl}/adLogs/activity-logs?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse JSON từ body của response
      const data = await response.json();

      // Lấy phần `data` từ kết quả trả về
      setLogs(data.data); // Đặt logs với phần data thực tế
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  // Tính toán phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = logs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(logs.length / recordsPerPage);

  // Handle filter changes
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  // Handle page change
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Lịch Sử Hoạt Động</h1>

        {/* Filter Section */}
        <div style={styles.filterContainer}>
          <input
            type="text"
            name="user_id"
            placeholder="ID Nhân viên"
            value={filters.user_id}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            style={styles.filterInput}
          >
            <option value="">Tất cả hoạt động</option>
            <option value="insert">Thêm dữ liệu</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
          </select>
          <span style={styles.dateLabel}>Từ</span>
          <input
            type="date"
            name="from_date"
            value={filters.from_date}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <span style={styles.dateLabel}>Đến</span>
          <input
            type="date"
            name="to_date"
            value={filters.to_date}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
        </div>

        {/* Table Section */}
        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.loading}>Đang tải...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID Nhân viên</th>
                  <th style={styles.th}>Hoạt động</th>
                  <th style={styles.th}>Bảng dữ liệu</th>
                  <th style={styles.th}>ID bản ghi</th>
                  <th style={styles.th}>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(log => (
                  <tr key={log.id}>
                    <td style={styles.td}>{log.user_id}</td>
                    <td style={styles.td}>{log.action}</td>
                    <td style={styles.td}>{log.table_name}</td>
                    <td style={styles.td}>{log.record_id}</td>
                    <td style={styles.td}>{new Date(log.created_at).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        {!loading && logs.length > 0 && (
          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === index + 1 ? styles.activePageButton : {}),
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    margin: 'auto',
    paddingTop: '120px',
    maxWidth: '1200px',
    paddingBottom: '50px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  tableContainer: {
    border: '1px solid #ccc',
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed', // Đặt cố định
    bottom: '100px', // Cách cạnh dưới 20px
    left: '50%', // Căn giữa theo chiều ngang
    transform: 'translateX(-50%)', // Dịch chuyển để căn giữa
    backgroundColor: 'white', // Nền trắng
    padding: '10px',
    borderRadius: '8px',
    // boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Đổ bóng nhẹ
  },
  pageButton: {
    margin: '0 5px',
    padding: '5px 10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  activePageButton: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    flexWrap: 'wrap',
  },
  filterInput: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '200px',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    color: '#666',
  },
  container: {
    margin: 'auto',
    paddingTop: '120px',
    maxWidth: '1200px',
    paddingBottom: '50px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  tableContainer: {
    border: '1px solid #ccc',
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
  pageButton: {
    margin: '0 5px',
    padding: '5px 10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  activePageButton: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  dateLabel: {
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    margin: '0 10px',
    fontSize: '14px',
  },
};

export default Logs;
