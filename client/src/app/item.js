import Footer from "../components/footer";
import Header from "../components/header";
import { useState } from "react";

// Các danh mục
const categories = [
  "Lương thực",
  "Đồ dùng sinh hoạt",
  "Dụng cụ y tế, vệ sinh",
  "Các đồ dùng khác",
  "Đồ dùng hỗ trợ đặc biệt",
  "Tất cả",
];

// Các kho
const warehouses = ["Kho 1", "Kho 2", "Kho 3", "Kho 4"];

// Các vật phẩm mẫu trong bảng
const items = [
  { name: "Tên", quantity: "Số lượng", expiration: "Hạn sử dụng" },
  { name: "Tên", quantity: "Số lượng", expiration: "Hạn sử dụng" },
  { name: "Tên", quantity: "Số lượng", expiration: "Hạn sử dụng" },
  { name: "Tên", quantity: "Số lượng", expiration: "Hạn sử dụng" },
  // ... thêm nhiều mục để kiểm tra thanh cuộn
];

export default function ItemPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Kho 1");

  return (
    <>
      <Header />
      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.categoryHeader}>
            <span>Danh sách kho</span>
          </div>
          
          <select
            style={styles.dropdown}
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouses.map((warehouse, index) => (
              <option key={index} value={warehouse}>
                {warehouse}
              </option>
            ))}
          </select>

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

        {/* Nội dung chính với bảng */}
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách vật phẩm</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Tên</th>
                  <th style={styles.tableHeader}>Số lượng</th>
                  <th style={styles.tableHeader}>Hạn sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{item.name}</td>
                    <td style={styles.tableCell}>{item.quantity}</td>
                    <td style={styles.tableCell}>{item.expiration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
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
};
