import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useParams } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const InfoRequest = () => {
  const [selectedTab, setSelectedTab] = useState("relatedArticles");
  const [data, setData] = useState({
    relatedArticles: [
      { id: 1, title: "Bài báo liên quan 1", url: "/article/1" },
      { id: 2, title: "Bài báo liên quan 2", url: "/article/2" },
      { id: 3, title: "Bài báo liên quan 3", url: "/article/3" },
    ],
  });
  const { requestId } = useParams();
  const [requestItem, setRequestItem] = useState([]);

  useEffect(() => {

    const fetchItems = async (requestId) => {
        try {
          const response = await fetch(
            `${apiUrl}/adRequest/items/request/${requestId}`,
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

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleAddArticle = (newArticle) => {
    setData((prevData) => ({
      ...prevData,
      relatedArticles: [
        ...prevData.relatedArticles,
        { id: prevData.relatedArticles.length + 1, ...newArticle },
      ],
    }));
  };

  return (
    <>
     <Header/>
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
                  {data.relatedArticles.map((article, index) => (
                    <tr key={article.id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <a href={article.url} style={styles.link}>
                          {article.title}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      <Footer/>
    </>
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


export default InfoRequest;
