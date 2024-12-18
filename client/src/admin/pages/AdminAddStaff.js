import React, { useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddUserModal({ onClose, onAdd, warehouse_id }) {
  const [newUser, setNewUser] = useState({
    user_name: "",
    email: "",
    password: "",
    full_name: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    const { user_name, password, email, full_name, role } = newUser;

    if (!user_name || !password || !email || !full_name || !role) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/admin/warehouses/employees`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT token for authentication
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name, password, email, full_name, role, warehouse_id }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Employee added successfully');
        onAdd({ user_name, email, full_name, role }); // Call the onAdd callback to update the list of employees
        onClose(); // Close the modal after adding
      } else {
        alert(result.message || 'Error adding employee');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while adding the employee');
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3 style={styles.title}>Thêm nhân viên mới</h3>
        <label style={styles.label}>
          Tên tài khoản:
          <input
            type="text"
            name="user_name"
            value={newUser.user_name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Mật khẩu:
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Họ và tên:
          <input
            type="text"
            name="full_name"
            value={newUser.full_name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Vị trí:
          <input
            type="text"
            name="role"
            value={newUser.role}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <div style={styles.modalActions}>
          <button style={styles.saveButton} onClick={handleAddUser}>
            Thêm
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
    zIndex: 1000,
  },
  modalContent: {
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#ddd",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};
