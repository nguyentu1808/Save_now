import Footer from "../components/footer";
import Header from "../components/header";
import { useState } from "react";
import EditUserModal from "../components/edit_info_user";

const initialUsers = [
  { id: 1, username: "user1", email: "user1@gmail.com", fullName: "User One", role: "Admin" },
  { id: 2, username: "user2", email: "user2@gmail.com", fullName: "User Two", role: "User" },
  { id: 3, username: "user3", email: "user3@gmail.com", fullName: "User Three", role: "User" },
  { id: 4, username: "user4", email: "user4@gmail.com", fullName: "User Four", role: "User" },
  { id: 5, username: "user5", email: "user5@gmail.com", fullName: "User Five", role: "User" },
  { id: 6, username: "user6", email: "user6@gmail.com", fullName: "User Six", role: "Admin" },
  { id: 7, username: "user7", email: "user7@gmail.com", fullName: "User Seven", role: "User" },
  { id: 8, username: "user8", email: "user8@gmail.com", fullName: "User Eight", role: "User" },
  { id: 9, username: "user9", email: "user9@gmail.com", fullName: "User Nine", role: "Admin" },
  { id: 10, username: "user10", email: "user10@gmail.com", fullName: "User Ten", role: "User" },
];

export default function ListUser() {
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(null); 
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleEdit = (user) => {
    setEditUser(user); 
  };

  const handleSaveUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <>
      <Header />
      <main style={styles.main}>
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách người dùng</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>User Name</th>
                  <th style={styles.tableHeader}>Gmail</th>
                  <th style={styles.tableHeader}>Full Name</th>
                  <th style={styles.tableHeader}>Role</th>
                  <th style={styles.tableHeader}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.username}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.fullName}</td>
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
        </section>

        {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveUser}
        />
      )}
      </main>
      <Footer />
    </>
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
};
