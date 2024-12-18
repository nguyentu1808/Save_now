import Layout from "../layout";
import { useState, useEffect } from "react";
import EditUserModal from "./AdminEditStaff";
import AddUserModal from "./AdminAddStaff";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AdminListStaff() {
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState( {
    id: 1,
    name: 'Kho Miền Bắc',
  });
  const itemsPerPage = 8;

  // Lấy danh sách kho khi component mount
  useEffect(() => {
    fetchWarehouses();
  }, []);

  //Lấy danh sách users khi selectedWarehouse thay đổi
  useEffect(() => {
    if (selectedWarehouse.id && selectedWarehouse.id !== '') {
      fetchUsers(selectedWarehouse.id);
    }
  }, [selectedWarehouse]);

  // Hàm lấy danh sách kho
  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/warehouses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWarehouses(data);
      if (data.length > 0) {
        setSelectedWarehouse({
          id: data[0].id,
          name: data[0].name
        });
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };


  //Hàm lấy danh sách users theo warehouse_id
  const fetchUsers = async (warehouseId) => {
    try {
      const response = await fetch(`${apiUrl}/admin/warehouses/${warehouseId}/employees`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleWarehouseChange = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Chuyển giá trị thành số
    const warehouse = warehouses.find((w) => w.id === selectedId); // Tìm object kho
    setSelectedWarehouse(warehouse); // Cập nhật object kho
    setCurrentPage(1); // Reset về trang 1 khi đổi kho
  };
  

  const handleDelete = async(id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      return; // Người dùng hủy hành động xóa
    }
  
    try {
      const response = await fetch(`${apiUrl}/admin/deleteEmployee/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Không thể xóa nhân viên");
      }
  
      const data = await response.json();
  
      // Xóa nhân viên khỏi danh sách hiển thị nếu xóa thành công
      if (data.success) {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        alert(data.message || "Nhân viên đã được xóa thành công");
      } else {
        alert(data.message || "Có lỗi xảy ra khi xóa nhân viên");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi xóa nhân viên");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };
  return (
    <Layout>
      <main style={styles.main}>
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách nhân viên</h2>

          <aside style={styles.filter}>
            <select
              style={styles.dropdown}
              value={selectedWarehouse.id || ''}
              onChange={handleWarehouseChange}
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </aside>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Tên tài khoản</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Họ và tên</th>
                  <th style={styles.tableHeader}>Vị trí</th>
                  <th style={styles.tableHeader}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.user_name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.full_name}</td>
                    <td style={styles.tableCell}>{user.role}</td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                style={{
                  ...styles.pageButton,
                  backgroundColor:
                    currentPage === index + 1 ? "#007bff" : "#f1f1f1",
                  color: currentPage === index + 1 ? "white" : "black",
                }}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            style={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            Thêm nhân viên
          </button>
        </section>

        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSaveUser}
          />
        )}

        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddUser}
            warehouse_id = {selectedWarehouse.id}
          />
        )}
      </main>
    </Layout>
  );
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "60px",
    paddingBottom: "30px",
    alignItems: "center",
  },
  content: {
    width: "80%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  filter: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "30px",
    marginTop: "20px",
  },
  tableContainer: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "5px",
    height: "calc(8 * 40px + 160px)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  tableHeader: {
    padding: "10px",
    backgroundColor: "#c2c2c2",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    height: "40px",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    gap: "5px",
  },
  pageButton: {
    padding: "5px 10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#95c8ef",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#95c8ef",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  addButton: {
    position: "fixed",
    bottom: "150px",
    right: "100px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "5px 10px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  addButton: {
    position: "fixed",
    bottom: "150px",
    right: "100px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
