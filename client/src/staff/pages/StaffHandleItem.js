import { useState, useEffect } from "react";

export default function AddItemModal({
  onClose,
  onSave,
  editingItem,
  categories,
  warehouse_id,
}) {
  const [item, setItem] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    expiration_date: "",
    category: categories[0], // Chọn category đầu tiên làm mặc định
    contributor_name: "",
  });

  useEffect(() => {
    if (editingItem) setItem(editingItem);
  }, [editingItem]);

  const mysqlDateFormat = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!item.name || !item.quantity) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const formattedDate = item.expiration_date
      ? mysqlDateFormat(item.expiration_date)
      : null;
    if (editingItem) {
      try {
        // console.log(item);
        const response = await fetch(
          `http://localhost:5001/staff/item/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              expiration_date: formattedDate,
              category: item.category,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update item");
        }

        // Nếu thành công, gọi onSave để cập nhật lại danh sách nhân viên
        onSave(item);
        onClose();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    } else {
      try {
        console.log(item);
        const response = await fetch("http://localhost:5001/staff/addItem", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using JWT token for authentication
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            expiration_date: formattedDate,
            category: item.category,
            warehouse_id: warehouse_id,
            contributor_name: item.contributor_name
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Item added successfully");
          onSave(item); // Call the onAdd callback to update the list of employees
          onClose(); // Close the modal after adding
        } else {
          alert(result.message || "Error adding item");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while adding the item");
      }
    }
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
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={item.quantity}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="text"
          name="unit"
          placeholder="Đơn vị"
          value={item.unit}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="date"
          name="expiration_date"
          value={item.expiration_date ? item.expiration_date.split("T")[0] : ""} // Chuyển đổi ngày hiển thị
          onChange={(e) => {
            const dateOnly = e.target.value; // Lấy giá trị ngày
            setItem((prev) => ({
              ...prev,
              expiration_date: `${dateOnly}T00:00:00.000Z`, // Đặt mặc định thời gian là 00:00:00
            }));
          }}
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
        <input
          style={styles.input}
          type="text"
          name="contributor_name"
          placeholder="Người đóng góp"
          value={item.contributor_name}
          onChange={handleChange}
        />
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
