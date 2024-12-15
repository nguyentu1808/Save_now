import React, { useState } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Gửi yêu cầu cập nhật thông tin nhân viên tới API
      const response = await fetch(
        `http://localhost:5001/admin/employee/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: editedUser.user_name,
            email: editedUser.email,
            full_name: editedUser.full_name,
            role: editedUser.role
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      // Nếu thành công, gọi onSave để cập nhật lại danh sách nhân viên
      onSave(editedUser);
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Chỉnh sửa thông tin</h3>
        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Tên tài khoản:
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={editedUser.user_name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Họ và tên:
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={editedUser.full_name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>
              Vị trí:
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={editedUser.role}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
        </form>
        <div style={styles.actions}>
          <button style={styles.button} onClick={handleSave}>
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
  overlay: {
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
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "400px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  label: {
    flex: "0 0 100px",
    textAlign: "right",
    marginRight: "10px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    flex: "1",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 15px",
    backgroundColor: "#ccc",
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
