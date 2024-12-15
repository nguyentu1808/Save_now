import Layout from "../layout";
import { useState, useEffect } from "react";
import EditWarehouseModal from "../../components/edit_warehouse";
import AddWarehouseModal from "../../components/add_warehouse";

export default function AdminWarehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editWarehouse, setEditWarehouse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    // Gọi API để lấy danh sách kho
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/admin/warehouses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch warehouses");
        }
        const data = await response.json();
        setWarehouses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(warehouses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/admin/deleteWarehouse/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setWarehouses((prevWarehouses) =>
          prevWarehouses.filter((warehouse) => warehouse.id !== id)
        );
      } else {
        throw new Error("Failed to delete warehouse");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (warehouse) => {
    setEditWarehouse(warehouse);
  };

  const handleSaveWarehouse = (updatedWarehouse) => {
    setWarehouses((prevWarehouses) =>
      prevWarehouses.map((warehouse) =>
        warehouse.id === updatedWarehouse.id ? updatedWarehouse : warehouse
      )
    );
    setEditWarehouse(null);
  };

  const handleAddWarehouse = (newWarehouse) => {
    setWarehouses((prevWarehouses) => [...prevWarehouses, newWarehouse]);
    setShowAddModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Layout>
      <main style={styles.main}>
        <section style={styles.content}>
          <h2 style={styles.title}>Danh sách kho</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Tên kho</th>
                  <th style={styles.tableHeader}>Địa điểm</th>
                  <th style={styles.tableHeader}>Sức chứa</th>
                  <th style={styles.tableHeader}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{warehouse.name}</td>
                    <td style={styles.tableCell}>{warehouse.location}</td>
                    <td style={styles.tableCell}>{warehouse.capacity}</td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(warehouse)}
                      >
                        Sửa
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(parseInt(warehouse.id))}
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
            Thêm kho
          </button>
        </section>

        {editWarehouse && (
          <EditWarehouseModal
            warehouse={editWarehouse}
            onClose={() => setEditWarehouse(null)}
            onSave={handleSaveWarehouse}
          />
        )}
        {showAddModal && (
          <AddWarehouseModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddWarehouse}
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
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#95c8ef",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#f08080",
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
};
