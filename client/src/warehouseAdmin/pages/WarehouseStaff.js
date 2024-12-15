import Layout from "../layout";
import { useState, useEffect } from "react";
import EditUserModal from "./WarehouseEditStaff";
import AddUserModal from "./WarehouseAddStaff";

export default function AdminWarehouseListStaff() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/adminW/employees', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Thay token nếu lưu trữ ở nơi khác
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchUsers();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      return; // Người dùng hủy hành động xóa
    }
  
    try {
      const response = await fetch(`http://localhost:5001/adminW/deleteEmployee/${id}`, {
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

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <Layout>
      <main style={styles.main}>
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách nhân viên</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Tên tài khoản</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Họ và tên</th>
                  <th style={styles.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.user_name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.full_name}</td>
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
  filter: {},
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
  detailButton: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    padding: "5px 10px",
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
