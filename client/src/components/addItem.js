import { useState, useEffect } from "react";

export default function AddItemModal({ onClose, onSave, editingItem, categories }) {
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    expiration: "",
    category: categories[0], // Chọn category đầu tiên làm mặc định
  });

  useEffect(() => {
    if (editingItem) setItem(editingItem);
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!item.name || !item.quantity || !item.expiration) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(item);
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3>{editingItem ? "Sửa Vật Phẩm" : "Thêm Vật Phẩm"}</h3>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Tên"
          value={item.name}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="quantity"
          placeholder="Số lượng"
          value={item.quantity}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="date"
          name="expiration"
          value={item.expiration}
          onChange={handleChange}
        />
        <select
          style={styles.input}
          name="category"
          value={item.category}
          onChange={handleChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
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
    zIndex: 2,
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
