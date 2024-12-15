import Layout from "../layout";
import { useState, useEffect } from "react";
import AddItemModal from "./StaffHandleItem";
import UsingItem from "./StaffUsingItem";

// Các danh mục
const categories = [
  "Lương thực",
  "Đồ dùng sinh hoạt",
  "Dụng cụ y tế, vệ sinh",
  "Các đồ dùng khác",
  "Đồ dùng hỗ trợ đặc biệt",
  "Đã gửi",
  "Đã hết hạn",
  "Tất cả",
];

export default function StaffItemPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showUsingModal, setShowUsingModal] = useState(false);

  // Lấy danh sách kho khi component mount
  useEffect(() => {
    fetchItems();
  }, []);

  //Hàm lấy danh sách item theo warehouse_id
  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5001/staff/items", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Thêm hoặc cập nhật vật phẩm
  const handleSave = (item) => {
    if (item.id) {
      // Sửa vật phẩm
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Thêm vật phẩm mới
      setItems((prev) => [
        ...prev,
        { ...item, id: Math.max(...prev.map((i) => i.id), 0) + 1 },
      ]);
    }
  };

  // Xóa vật phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vật phẩm này không?")) {
      return; // Người dùng hủy hành động xóa
    }

    try {
      const response = await fetch(
        `http://localhost:5001/staff/deleteItem/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa vật phẩm");
      }

      const data = await response.json();

      // Xóa nhân viên khỏi danh sách hiển thị nếu xóa thành công
      if (data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        alert(data.message || "Vật phẩm đã được xóa thành công");
      } else {
        alert(data.message || "Có lỗi xảy ra khi xóa vật phẩm");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Có lỗi xảy ra khi xóa vật phẩm");
    }
  };

  return (
    <Layout>
      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <ul style={styles.categoryList}>
            {categories.map((category, index) => (
              <li
                key={index}
                style={{
                  ...styles.categoryItem,
                  fontWeight: category === selectedCategory ? "bold" : "normal",
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>
        {/* Nội dung chính */}
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách vật phẩm</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Tên</th>
                  <th style={styles.tableHeader}>Số lượng</th>
                  <th style={styles.tableHeader}>Hạn sử dụng</th>
                  <th style={styles.tableHeader}>Danh mục</th>
                  {selectedCategory !== "Đã gửi" &&
                    selectedCategory !== "Đã hết hạn" && (
                      <th style={styles.tableHeader}>Hành động</th>
                    )}
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((item) => {
                    const today = new Date(); // Lấy ngày hiện tại

                    // Điều kiện lọc
                    if (selectedCategory === "Tất cả") {
                      // Hiển thị tất cả các mục chưa hết hạn và chưa sử dụng
                      return (
                        item.is_used === 0 &&
                        (!item.expiration_date ||
                          new Date(item.expiration_date) >= today)
                      );
                    } else if (selectedCategory === "Đã hết hạn") {
                      // Kiểm tra ngày hết hạn
                      return (
                        item.expiration_date &&
                        new Date(item.expiration_date) < today
                      );
                    } else if (selectedCategory === "Đã gửi") {
                      return item.is_used === 1;
                    } else {
                      // Lọc theo danh mục
                      return item.category === selectedCategory;
                    }
                  })
                  .map((item) => (
                    <tr key={item.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{item.name}</td>
                      <td style={styles.tableCell}>{item.quantity}</td>
                      <td style={styles.tableCell}>
                        {item.expiration_date
                          ? new Date(item.expiration_date).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </td>

                      <td style={styles.tableCell}>{item.category}</td>
                      {selectedCategory !== "Đã gửi" &&
                        selectedCategory !== "Đã hết hạn" && (
                          <td style={styles.tableCell1}>
                            <button
                              style={styles.editButton}
                              onClick={() => {
                                setEditingItem(item);
                                setShowModal(true);
                              }}
                            >
                              Sửa
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => handleDelete(item.id)}
                            >
                              Xóa
                            </button>
                            <button
                              style={styles.useButton}
                              onClick={() => {
                                setShowUsingModal(true);
                                setEditingItem(item);
                              }}
                            >
                              Sử dụng
                            </button>
                          </td>
                        )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <button
            style={styles.addButton}
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
          >
            Thêm Vật Phẩm
          </button>
        </section>
        {showModal && (
          <AddItemModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            editingItem={editingItem}
            categories={categories}
          />
        )}
        {showUsingModal && (
          <UsingItem
            onClose={() => setShowUsingModal(false)}
            itemId={editingItem.id}
            quantity1 = {editingItem.quantity}
          />
        )}
      </main>
    </Layout>
  );
}

const styles = {
  main: {
    display: "flex",
    paddingTop: "60px",
    paddingBottom: "30px",
  },
  sidebar: {
    width: "200px",
    minHeight: "calc(100vh - 150px)",
    backgroundColor: "#f2f2f2",
    padding: "20px",
    borderRight: "1px solid #ddd",
  },
  categoryHeader: {
    fontWeight: "bold",
    marginBottom: "20px",
  },
  dropdown: {
    width: "100%",
    padding: "10px",
    marginBottom: "30px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  categoryList: {
    listStyleType: "none",
    padding: 0,
  },
  categoryItem: {
    cursor: "pointer",
    padding: "8px 0",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    width: "1000px",
    height: "500px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "5px",
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
    border: "1px solid #ddd",
    textAlign: "left",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    borderLeft: "1px solid #ddd",
    textAlign: "left",
  },
  tableCell1: {
    padding: "10px",
    borderLeft: "1px solid #ddd",
    textAlign: "center",
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
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    backgroundColor: "#95c8ef",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#95c8ef",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  useButton: {
    padding: "5px 10px",
    marginTop: "5px",
    backgroundColor: "#95c8ef",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
