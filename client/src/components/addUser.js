import { useState } from "react";

export default function AddUserModal({ onClose, onAdd }) {
  const [newUser, setNewUser] = useState({
    id : 11,
    username: "",
    email: "",
    fullName: "",
    // password: "",
    role: "Staff", // Mặc định là Staff
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onAdd(newUser);
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3>Thêm Nhân Viên</h3>
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="User Name"
          value={newUser.username}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Gmail"
          value={newUser.email}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
        //   value={newUser.password}
        //   onChange={handleChange}
        />
        <select
          style={styles.input}
          name="role"
          value={newUser.role}
          onChange={handleChange}
        >
          <option value="Admin">Admin</option>
          <option value="AdminW">Admin WareHouse</option>
          <option value="Staff">Staff</option>
        </select>
        <div style={styles.modalActions}>
          <button style={styles.saveButton} onClick={handleSave}>
            Lưu
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
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
