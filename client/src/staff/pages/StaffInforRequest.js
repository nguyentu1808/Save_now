import React, { useState, useEffect } from "react";
import Layout from "../layout";
import AddArticle from "../../components/addArticle";
import { useParams } from "react-router-dom";

const StaffInfoRequest = () => {

  const [selectedTab, setSelectedTab] = useState("relatedArticles");
  const [articles, setArticles] = useState([]);
  const { requestId } = useParams();
  const [requestItem, setRequestItem] = useState([]);

  useEffect(() => {

    const fetchItems = async (requestId) => {
        try {
          const response = await fetch(
            `http://localhost:5001/adRequest/items/request/${requestId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setRequestItem(data);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };

    fetchItems(requestId);
  }, [requestId]);

  useEffect(() => {
    fetchArticle(requestId);
  }, []);

  //Hàm lấy danh sách bài báo
  const fetchArticle = async (requestId) => {
    try {
        const response = await fetch(`http://localhost:5001/adRequest/article/${requestId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using JWT token for authentication
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log("API response:", data);
        setArticles(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleAddArticle = (newArticle) => {
    setArticles([...articles, newArticle]);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button
            onClick={() => handleTabClick("relatedArticles")}
            style={{
              ...styles.navButton,
              ...(selectedTab === "relatedArticles" ? styles.activeTab : {}),
            }}
          >
            Các bài báo liên quan
          </button>
          <button
            onClick={() => handleTabClick("itemStats")}
            style={{
              ...styles.navButton,
              ...(selectedTab === "itemStats" ? styles.activeTab : {}),
            }}
          >
            Bảng Thống Kê Vật Phẩm
          </button>
        </nav>

        <div style={styles.content}>
          {selectedTab === "relatedArticles" && (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>STT</th>
                    <th style={styles.th}>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr key={article.id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <a href={article.url} style={styles.link}>
                          {article.name}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AddArticle onAdd={handleAddArticle} requestId = {requestId} />
            </div>
          )}

          {selectedTab === "itemStats" && (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Tên</th>
                    <th style={styles.th}>Số lượng</th>
                    <th style={styles.th}>Hạn sử dụng</th>
                    <th style={styles.th}>Danh mục</th>
                    <th style={styles.th}>Người đóng góp</th>
                  </tr>
                </thead>
                <tbody>
                  {requestItem.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>{item.expiration}</td>
                      <td style={styles.td}>{item.category}</td>
                      <td style={styles.td}>{item.contributor_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    margin: "auto",
    paddingTop:"80px",
    maxWidth: "1200px",
    paddingBottom: '50px',
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "50px",
  },
  navButton: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    textDecoration: "none",
    color: "#333",
    marginRight: "20px",
  },
  activeTab: {
    textDecoration: "underline",
    fontWeight: "bold",
  },
  content: {
    marginTop: "20px",
  },
  tableContainer: {
    height: "calc(8 * 40px + 160px)", // Chiều cao của bảng
    overflowY: "auto", // Thanh cuộn dọc
    border: "1px solid #ccc", // Thêm đường viền cho container
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginLeft: "auto",
    marginRight: "auto",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
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
  link: {
    textDecoration: "none",
    color: "#007bff",
  },
};

export default StaffInfoRequest;
