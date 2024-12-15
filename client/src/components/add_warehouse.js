import React, { useState } from "react";

export default function AddWarehouseModal({ onClose, onAdd }) {
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse({ ...newWarehouse, [name]: value });
  };

  const handleAdd = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/admin/addWarehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần xác thực
        },
        body: JSON.stringify({
          name: newWarehouse.name,
          location: newWarehouse.location,
          capacity: parseInt(newWarehouse.capacity), // Chuyển `capacity` thành số nguyên
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onAdd(newWarehouse); // Gọi callback với dữ liệu trả về từ API
        onClose(); // Đóng modal sau khi thêm thành công
      } else {
        setError(data.message || "Có lỗi xảy ra khi thêm kho mới.");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3 style={styles.title}>Thêm kho mới</h3>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>
          Tên kho:
          <input
            type="text"
            name="name"
            value={newWarehouse.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Địa điểm:
          <input
            type="text"
            name="location"
            value={newWarehouse.location}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Sức chứa:
          <input
            type="number"
            name="capacity"
            value={newWarehouse.capacity}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <div style={styles.modalActions}>
          <button
            style={styles.saveButton}
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
          <button style={styles.cancelButton} onClick={onClose} disabled={loading}>
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
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "center",
  },
};
